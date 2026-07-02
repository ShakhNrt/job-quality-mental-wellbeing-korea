[[Introduction to Economic Data|← Back to Course Overview]]

# KWCS 2023: Variable Dictionary

This document decodes the 435 variables found in the 7th Korean Working Conditions Survey.

## 1. Survey Metadata & Weights
*   **id**: Unique respondent identifier.
*   **wt1 - wt4**: Design and standardized weights (use these for calculating national averages).
*   **area**: Region (1: Seoul, 2: Busan, etc.).
*   **stratification / district**: Geographic survey sampling units.

## 2. Basic Demographics
*   **gender**: 1: Male, 2: Female.
*   **year**: Year of birth.
*   **age**: Respondent's age.
*   **marital**: Marital status.
*   **children**: Number of children in the household.
*   **edu**: Education level (Primary, Secondary, University, etc.).

## 3. Employment Status (The "Logic" Branches)
*   **estat / emp_type**: Overall employment category (Self-employed vs. Employee vs. Family worker).
*   **ind / ind2**: Industry codes (e.g., Agriculture, Manufacturing, Service).
*   **occ / occ2**: Occupation codes (e.g., Manager, Professional, Manual Labor).

## 4. Self-Employed Modules (`selfemp_...` / `semp_...`)
*   **selfemp_be**: Reason for becoming self-employed (Preference vs. No alternative).
*   **selfemp_cate3-7**: Type of business (Partner, Freelancer, Digital Platform worker).
*   **selfemp_price**: Who sets the prices (Self vs. Client vs. Market).
*   **income_client**: Dependence on a single major client.
*   **selfemp_sw1-4**: Subjective well-being of being your own boss.
*   **semp_tra...**: Training and skill development for self-employed.

## 5. Employee Modules (`emp_...`)
*   **emp_stat**: Type of employee (Permanent, Temporary, Day laborer).
*   **emp_con_term**: Fixed-term contract status.
*   **emp_wage / emp_pay_type**: How the respondent is paid (Monthly salary, Piece rate, etc.).
*   **emp_fptime**: Full-time vs. Part-time status.
*   **emp_boss_gender**: Gender of the immediate supervisor.
*   **emp_manaqual1-5**: Quality of management (Support, feedback, etc.).

## 6. Unpaid Family Workers (`unfw_...`)
*   *Similar to the employee module, but specifically for people working in family businesses without a formal wage.*

## 7. Workplace Details
*   **wsector**: Work sector (Public vs. Private).
*   **comp_size1-4**: Number of people working at the local site/company.
*   **comp_female**: Percentage of female workers in the workplace.
*   **wduration**: How long the respondent has worked at this current job.

## 8. Working Time (`wtime_...` / `wday...`)
*   **wtime_week**: Total actual hours worked per week.
*   **wday_week**: Number of days worked per week.
*   **wtime_night / wtime_sun / wtime_sat**: Frequency of working nights or weekends.
*   **wtime_long**: Frequency of working more than 10 hours a day.
*   **wshift**: Shift work status.

## 9. Working Conditions & Hazards (`hazard_...`)
*   **hazard_phy1-9**: Physical hazards (Vibration, Noise, High/Low Temp).
*   **hazard_erg1-6**: Ergonomic hazards (Tiring positions, heavy loads, repetitive movements).
*   **hazard_psy1-3**: Psychosocial hazards (Dealing with angry customers, high speed work).

## 10. Earnings & Income
*   **earning1**: Main monthly income (Actual amount or bracket).
*   **earning2**: Secondary income.
*   **income_con**: Consistency of income.
*   **income_bal**: Satisfaction with the income level.

## 11. Health & Well-being
*   **heal_risk**: Do you feel your work affects your health?
*   **heal_abs1-3**: Absence from work due to health issues.
*   **heal_prob1-8**: Specific health problems (Backache, Muscular pains, Stress, Sleep issues).
*   **who1 - who5**: The WHO-5 Well-being Index (Standardized mental health score).
*   **satisfaction**: Overall job satisfaction level.

## 12. Work-Life Balance
*   **wbalance**: Fit between working hours and private/family life.
*   **wtime_private**: Ability to take an hour or two off for personal matters.

## 13. Workplace Dynamics
*   **disc1-11**: Experience of discrimination (Age, Gender, Nationality, etc.).
*   **wteam1-3**: Teamwork and collaboration status.
*   **ass_cust**: Interaction with customers/clients.

## 14. Household Members (`hm_...`)
*   **hm_01_gender** to **hm_08_rel_t**: Gender, Year of Birth, and Relationship to respondent for up to 8 people in the household.

## 15. Recoded Variables (`..._r`)
*   **earning1_r / wtime_r**: These are "Recoded" versions of the main variables, usually grouped into cleaner categories (e.g., 0-20 hours, 20-40 hours) by the survey providers.
