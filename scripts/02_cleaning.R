library(tidyverse)
library(summarytools)
# -------------------------------- #
raw_df <- readRDS("./data/kwcs_raw.rds")

df_employees <- raw_df %>%
  filter(emp_stat %in% c(1, 2, 3))
table(df_employees$emp_stat)


# Cleaned Dataset Creation ------------------------------------------------------
cdf <- df_employees %>%
  select(
    # Well-being (WHO-5 Components)
    who1,
    who2,
    who3,
    who4,
    who5,

    # Safety (exposure to physical hazards — all 9 items)
    safety_phy1 = hazard_phy1,
    safety_phy2 = hazard_phy2,
    safety_phy3 = hazard_phy3,
    safety_phy4 = hazard_phy4,
    safety_phy5 = hazard_phy5,
    safety_phy6 = hazard_phy6,
    safety_phy7 = hazard_phy7,
    safety_phy8 = hazard_phy8,
    safety_phy9 = hazard_phy9,

    # Autonomy (choose order/methods/speed of tasks)
    autonomy_order = decla1,
    autonomy_method = decla2,
    autonomy_speed = decla3,

    # Management Quality (boss respects, coordinates, helps)
    manager_respect = emp_manaqual1,
    manager_coordinate = emp_manaqual2,
    manager_help = emp_manaqual3,

    # 4.3 Control Variables (Working Time, Rewards, Demographics)
    weekly_hours = wtime_r,
    time_private = wtime_private,
    pay_appropriate = wstat1,
    career_advancement = wstat2,
    age,
    gender,
    occupation = occ,

    # 4.4 Sampling Weights
    weight = wt3
  )

# Missing Values -------------------------------------------------
# For WHO-5 and job quality variables, treat 8 (Don't know) and 9 (Not applicable) as missing
cleaned_df <- cdf %>%
  mutate(across(
    c(
      who1:who5,
      safety_phy1:safety_phy9,
      autonomy_order,
      autonomy_method,
      autonomy_speed,
      manager_respect,
      manager_coordinate,
      manager_help,
      time_private,
      pay_appropriate,
      career_advancement
    ),
    ~ ifelse(.x %in% c(8, 9), NA, .x)
  )) %>%

  # For management quality variables, also treat 7 as missing (Don't know/Not applicable)
  mutate(across(
    c(
      manager_respect,
      manager_coordinate,
      manager_help,
      pay_appropriate,
      career_advancement
    ),
    ~ ifelse(.x == 7, NA, .x)
  )) %>%

  # Drop observations with missing values in variables with <1% missingness
  drop_na(
    who1:who5,
    safety_phy1:safety_phy9,
    autonomy_order,
    autonomy_method,
    autonomy_speed,
    time_private
  )

# Reverse code WHO-5 components so higher values = better well-being
cleaned_df <- cleaned_df %>%
  mutate(across(
    who1:who5,
    ~ 6 - .x
  ))

# Reverse code management quality variables so higher values = better management
cleaned_df <- cleaned_df %>%
  mutate(across(
    c(
      manager_respect,
      manager_coordinate,
      manager_help,
    ),
    ~ 6 - .x
  ))

# Reverse code autonomy variables so higher values = more autonomy
cleaned_df <- cleaned_df %>%
  mutate(across(
    c(
      autonomy_order,
      autonomy_method,
      autonomy_speed,
    ),
    ~ 2 - .x
  ))

# Recode control varriables
cleaned_df <- cleaned_df %>%
  mutate(
    is_female = ifelse(gender == 2, 1, 0), # Create binary gender
    time_private_rec = 5 - time_private, # Reverse code so higher = more private time
    pay_appropriate_rec = 6 - pay_appropriate, # Reverse code so higher = more appropriate pay
    career_advancement_rec = 6 - career_advancement # Reverse code so higher = better career advancement
  )


# Create Index Variables ------------------------------------------------------
cleaned_df <- cleaned_df %>%
  mutate(
    # Indices ---------------------------------------------------
    # Safety index: sum of 9 physical hazard exposures (0-9, higher = more hazards)
    safety_index = rowMeans(across(safety_phy1:safety_phy9), na.rm = TRUE),
    safety_index = (safety_index - 1) / 6 * 100,

    # Autonomy index: average of 3 autonomy items (0-1, higher = more autonomy)
    autonomy_index = rowMeans(
      across(c(autonomy_order, autonomy_method, autonomy_speed)),
      na.rm = TRUE
    ) *
      100,

    # Management quality index: average of 3 management quality items (0-1, higher = better management)
    manager_index = rowMeans(
      across(c(manager_respect, manager_coordinate, manager_help)),
      na.rm = TRUE
    ),
    manager_index = (manager_index - 1) / 4 * 100,

    # Scores ---------------------------------------------------
    job_quality_score = (safety_index + autonomy_index + manager_index) / 3, # Job quality score
    who_score = (who1 + who2 + who3 + who4 + who5) * 4 # Well-being score
  )

# Drop NA values in indices and scores
cleaned_df <- cleaned_df %>%
  drop_na(
    manager_index,
    weekly_hours,
    time_private_rec,
    pay_appropriate_rec,
    career_advancement_rec
  )


# Save cleaned data
saveRDS(cleaned_df, "./data/kwcs_cleaned.rds")
