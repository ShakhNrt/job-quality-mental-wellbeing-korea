# Packages #
library(tidyverse)
library(summarytools)
library(broom)
library(survey)
source("./theme/theme.R")
# -------------------------------- #
cleaned_df <- readRDS("./data/kwcs_cleaned.rds")
# -------------------------------- #

# Survey Design Specification ------------------------------------------------------

kwcs_design <- svydesign(
  ids = ~1,
  weights = ~weight,
  data = cleaned_df
)

# SECTION 1: Weighted Summary Statistics ---------------------------------------

# Defining the list of variables to summarize
summary_vars <- c(
  "who_score",
  "safety_index",
  "autonomy_index",
  "manager_index",
  "job_quality_score",
  "age",
  "is_female",
  "weekly_hours",
  "time_private_rec",
  "pay_appropriate_rec",
  "career_advancement_rec"
)

# Programmatically constructing the formula: ~ var1 + var2 + ...
formula_str <- as.formula(paste("~", paste(summary_vars, collapse = "+")))

# Calculating weighted means using the survey design object
weighted_means_obj <- svymean(formula_str, design = kwcs_design)
weighted_means <- coef(weighted_means_obj) # Extracting the numeric mean values

# Calculating weighted variances
weighted_vars_obj <- svyvar(formula_str, design = kwcs_design)

# Extracting diagonal (variances) and taking the square root to get Standard Deviations (SD)
weighted_sds <- sqrt(diag(as.matrix(weighted_vars_obj)))

# Combining variables, means, and SDs into a clean summary table
summary_table <- tibble(
  Variable = summary_vars,
  Mean = weighted_means,
  SD = weighted_sds
)

# SECTION 2: Correlation Analysis ---------------------------------------------

# Choosing key index variables to analyze their relationships
corr_vars <- c(
  "who_score",
  "safety_index",
  "autonomy_index",
  "manager_index",
  "job_quality_score"
)

# Constructing formula for covariance matrix: ~ who_score + safety_index + ...
corr_formula <- as.formula(paste("~", paste(corr_vars, collapse = "+")))

# Calculating the weighted covariance matrix under survey design
cov_matrix <- as.matrix(svyvar(corr_formula, design = kwcs_design))

# Converting covariance matrix to a correlation matrix (values between -1 and 1)
weighted_corr <- cov2cor(cov_matrix)

# Visualizations --------------------------------------------------

# Plot 1: WHO-5 Distribution Histogram
plot1 <- ggplot(cleaned_df, aes(x = who_score)) +
  geom_histogram(
    binwidth = 4,
    fill = pal$fill1,
    color = "white",
    alpha = plot_alpha
  ) +
  labs(
    title = "Distribution of WHO-5 Well-being Scores",
    subtitle = "Sample of South Korean wage workers (KWCS 2023)",
    x = "WHO-5 Score (0-100, higher = better well-being)",
    y = "Number of Workers",
    caption = "Source: 7th Korea Working Conditions Survey (2023)"
  ) +
  my_theme

ggsave(
  "plots/who_score_histogram.png",
  plot1,
  width = plot_width,
  height = plot_height,
  dpi = plot_dpi
)

# Plot 2: Job Quality Distribution Histogram
plot2 <- ggplot(cleaned_df, aes(x = job_quality_score)) +
  geom_histogram(
    binwidth = 2,
    fill = pal$fill2,
    color = "white",
    alpha = plot_alpha
  ) +
  labs(
    title = "Distribution of Composite Job Quality Scores",
    subtitle = "Equal-weighted average of safety, autonomy, and management quality",
    x = "Job Quality Score (0-100, higher = better job quality)",
    y = "Number of Workers",
    caption = "Source: 7th Korea Working Conditions Survey (2023)"
  ) +
  my_theme

ggsave(
  "plots/job_quality_histogram.png",
  plot2,
  width = plot_width,
  height = plot_height,
  dpi = plot_dpi
)

# Plot 3: Core Relationship Binned Scatter Plot
# Note: Instead of showing 26,000 scattered points, grouping workers into 10 equal-sized 
# groups (deciles) based on their Job Quality Score to clearly visualize the average trend.
binned_data <- cleaned_df %>%
  mutate(job_quality_decile = ntile(job_quality_score, 10)) %>% # Split sample into 10 deciles
  group_by(job_quality_decile) %>%
  summarize(
    mean_job_quality = weighted.mean(
      job_quality_score,
      w = weight,
      na.rm = TRUE
    ),
    mean_who_score = weighted.mean(who_score, w = weight, na.rm = TRUE)
  )

plot3 <- ggplot(binned_data, aes(x = mean_job_quality, y = mean_who_score)) +
  geom_line(color = pal$primary, linewidth = 1) +
  geom_point(color = pal$accent, size = 4) +
  scale_x_continuous(breaks = seq(30, 100, by = 5)) +
  scale_y_continuous(breaks = seq(50, 70, by = 5), limits = c(50, 70)) +
  labs(
    title = "WHO-5 Well-being by Job Quality Deciles",
    subtitle = "Mean well-being score for each 10% of workers by job quality",
    x = "Mean Job Quality Score (0-100)",
    y = "Mean WHO-5 Score (0-100)",
    caption = "Source: 7th Korea Working Conditions Survey (2023)"
  ) +
  my_theme_scatter
ggsave(
  "plots/core_relationship_binned.png",
  plot3,
  width = plot_width,
  height = plot_height,
  dpi = plot_dpi
)


# Plot 4: Sub-Index Comparison - Faceted Bar chart

# Mapping occupation codes to human-readable names
occupation_labels <- c(
  "1" = "Managers",
  "2" = "Professionals, and Related Workers",
  "3" = "Clerks",
  "4" = "Service Workers",
  "5" = "Sales Workers",
  "6" = "Skilled Agricultural, Forestry and Fishery Workers",
  "7" = "Craft and Related Trades Workers",
  "8" = "Equipment, Machine Operating and Assembling Workers",
  "9" = "Elementary Workers",
  "10" = "Armed Forces"
)

# Reshaping the data for ggplot (from wide format to long format)
occupation_data <- cleaned_df %>%
  group_by(occupation) %>%
  summarize(
    Safety = weighted.mean(safety_index, w = weight, na.rm = TRUE),
    Autonomy = weighted.mean(autonomy_index, w = weight, na.rm = TRUE),
    Management = weighted.mean(manager_index, w = weight, na.rm = TRUE)
  ) %>%
  # Reshaping Safety, Autonomy, and Management columns into rows so they can be colored using pivot_longer
  pivot_longer(
    cols = c(Safety, Autonomy, Management),
    names_to = "Dimension",
    values_to = "Score"
  ) %>%
  mutate(OccupationLabel = occupation_labels[as.character(occupation)]) %>%
  filter(!is.na(OccupationLabel))

plot4 <- ggplot(
  occupation_data,
  aes(x = Score, y = reorder(OccupationLabel, Score), fill = Dimension)
) +
  geom_bar(stat = "identity", position = "dodge", alpha = 0.9) +
  scale_fill_brewer(palette = "Set2") +
  labs(
    title = "Job Quality Dimensions by Occupation",
    subtitle = "Weighted mean sub-index scores across occupation groups",
    x = "Weighted Score (0-100)",
    y = "Occupation Group",
    caption = "Source: 7th Korea Working Conditions Survey (2023)"
  ) +
  my_theme

ggsave(
  "plots/sub_index_comparison.png",
  plot4,
  width = 11,
  height = 6,
  dpi = plot_dpi
)

# Plot 5: Regression Scatter Plot (Individual observations with linear fit)
plot5 <- ggplot(cleaned_df, aes(x = job_quality_score, y = who_score)) +
  geom_jitter(
    alpha = 0.05,
    size = 0.8,
    width = 0.5,
    height = 0.5,
    color = pal$muted
  ) +
  geom_smooth(
    method = "lm",
    formula = y ~ x,
    color = pal$accent,
    linewidth = 1.2,
    fill = pal$ci_fill,
    alpha = 0.2
  ) +
  labs(
    title = "Relationship Between Job Quality and Well-being",
    subtitle = "Linear fit with 95% confidence interval",
    x = "Job Quality Score (0-100)",
    y = "WHO-5 Well-being Score (0-100)",
    caption = "Note: Scatter points are jittered slightly for readability. Source: KWCS (2023)"
  ) +
  my_theme

ggsave(
  "plots/regression_scatter.png",
  plot5,
  width = plot_width,
  height = plot_height,
  dpi = plot_dpi
)

# SECTION 3: Regression Analysis ---------------------------------------------
# Note: Using svyglm() instead of standard lm() so that R calculates correct 
# survey-weighted coefficients and design-adjusted standard errors.

# Model 1: Base Model (No controls)
# Estimating the raw, uncontrolled relationship between Job Quality and WHO-5
model1 <- svyglm(
  who_score ~ job_quality_score,
  design = kwcs_design
)

# Model 2: Demographics Control
# Controlling for basic individual characteristics that might affect both job quality and well-being
model2 <- svyglm(
  who_score ~ job_quality_score + age + is_female + factor(occupation),
  design = kwcs_design
)

# Model 3: Working Conditions Control
# Adding hours worked and ability to take care of private matters as additional confounders
model3 <- svyglm(
  who_score ~ job_quality_score +
    age +
    is_female +
    factor(occupation) +
    weekly_hours +
    time_private_rec,
  design = kwcs_design
)

# Model 4: Full Control Model (Adds Job Rewards)
# Controlling for pay fairness and career advancement opportunities to isolate the intrinsic job quality effect
model4 <- svyglm(
  who_score ~ job_quality_score +
    age +
    is_female +
    factor(occupation) +
    weekly_hours +
    time_private_rec +
    pay_appropriate_rec +
    career_advancement_rec,
  design = kwcs_design
)

# Model 5: Decomposed Model
# Replacing the composite Job Quality Score with its three separate sub-indices
# analyzing which dimension (Safety, Autonomy, or Management) has the largest impact
decomp_model <- svyglm(
  who_score ~ safety_index +
    autonomy_index +
    manager_index +
    age +
    is_female +
    factor(occupation) +
    weekly_hours +
    time_private_rec +
    pay_appropriate_rec +
    career_advancement_rec,
  design = kwcs_design
)

# Plot 6: Coefficient Stability Plot (Job Quality across Models 1-4)

# Using broom::tidy() to extract coefficients and confidence intervals from each model,
# filtering for the target variable (job_quality_score), and binding them into a single dataframe.
stability_data <- bind_rows(
  tidy(model1, conf.int = TRUE) %>%
    filter(term == "job_quality_score") %>%
    mutate(model = "Model 1: Base"),
  tidy(model2, conf.int = TRUE) %>%
    filter(term == "job_quality_score") %>%
    mutate(model = "Model 2: + Demographics"),
  tidy(model3, conf.int = TRUE) %>%
    filter(term == "job_quality_score") %>%
    mutate(model = "Model 3: + Work Conditions"),
  tidy(model4, conf.int = TRUE) %>%
    filter(term == "job_quality_score") %>%
    mutate(model = "Model 4: + Rewards")
)

plot6 <- ggplot(
  stability_data,
  aes(x = estimate, y = fct_rev(factor(model, levels = unique(model))))
) +
  geom_vline(
    xintercept = 0,
    linetype = "dashed",
    color = "gray50",
    linewidth = 0.8
  ) +
  geom_errorbar(
    aes(xmin = conf.low, xmax = conf.high),
    width = 0.15,
    color = pal$primary,
    linewidth = 1
  ) +
  geom_point(color = pal$accent, size = 4) +
  labs(
    title = "Stability of Job Quality Effect on Well-being",
    subtitle = "Coefficient on Job Quality Score across progressively controlled models",
    x = "Change in WHO-5 per 1-unit increase in Job Quality (0-100)",
    y = NULL,
    caption = "Each model adds controls cumulatively. Source: KWCS (2023)"
  ) +
  my_theme

ggsave(
  "plots/coefficient_stability.png",
  plot6,
  width = 9,
  height = plot_height,
  dpi = plot_dpi
)
