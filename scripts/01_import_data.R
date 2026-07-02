# IED Final Project: Step 1 - Data Import
# Converts raw XLSX to RDS for efficient processing.

# 1. Define Paths
xlsx_path <- "data/kwcs_2023_7th_eng.xlsx"
rds_path <- "data/kwcs_raw.rds"

# 2. Import & Save (Run once)
if (!file.exists(rds_path)) {
  library(readxl)
  raw_data <- readxl::read_excel(xlsx_path)
  saveRDS(raw_data, rds_path)
} else {
  cat("RDS file already exists \n")
}
