library(showtext)
font_add_google("Montserrat", "montserrat")
showtext_auto()
showtext_opts(dpi = 300)

# Color palette (colorblind-safe, grayscale-distinguishable)
pal <- list(
  primary   = "#334155",
  accent    = "#0d9488",
  fill1     = "#0d9488",
  fill2     = "#f59e0b",
  fill3     = "#6366f1",
  fill4     = "#ec4899",
  muted     = "#94a3b8",
  ci_fill   = "#0ea5e9",
  bg        = "#fafbfc",
  grid      = "#e8ecf0"
)

# Plot defaults
plot_alpha <- 0.85
plot_dpi   <- 300
plot_width  <- 8
plot_height <- 5

# Reusable fill/color scales
scale_fill_pal <- function(...) {
  scale_fill_manual(values = unlist(pal[c("fill1", "fill2", "fill3", "fill4")]), ...)
}

scale_color_pal <- function(...) {
  scale_color_manual(values = unlist(pal[c("fill1", "fill2", "fill3", "fill4")]), ...)
}

# Main theme
my_theme <- theme_minimal(base_size = 14, base_family = "montserrat") +
  theme(
    plot.background    = element_rect(fill = pal$bg, color = NA),
    panel.background   = element_rect(fill = pal$bg, color = NA),
    plot.title         = element_text(face = "bold", size = 18, color = pal$primary,
                                      margin = margin(b = 4)),
    plot.subtitle      = element_text(size = 12, color = pal$muted, margin = margin(b = 14)),
    plot.caption       = element_text(size = 9, color = pal$muted, face = "italic",
                                      hjust = 0, margin = margin(t = 15)),
    plot.caption.position = "plot",
    axis.title.x       = element_text(size = 12, color = pal$primary, margin = margin(t = 10)),
    axis.title.y       = element_text(size = 12, color = pal$primary, margin = margin(r = 10)),
    axis.text          = element_text(size = 10, color = "gray40"),
    axis.line          = element_line(color = pal$grid, linewidth = 0.5),
    panel.grid.major.y = element_line(color = pal$grid, linewidth = 0.3),
    panel.grid.major.x = element_blank(),
    panel.grid.minor   = element_blank(),
    legend.position    = "top",
    legend.justification = "left",
    legend.title       = element_text(size = 10, face = "bold", color = pal$primary),
    legend.text        = element_text(size = 9, color = "gray40"),
    legend.key.size    = unit(0.4, "cm"),
    legend.background  = element_rect(fill = pal$bg, color = NA),
    plot.margin        = margin(20, 25, 15, 15),
    strip.text         = element_text(face = "bold", size = 11, color = pal$primary,
                                      margin = margin(b = 6))
  )

# Variant: keep x-grid for scatter plots
my_theme_scatter <- my_theme +
  theme(panel.grid.major.x = element_line(color = pal$grid, linewidth = 0.3))

