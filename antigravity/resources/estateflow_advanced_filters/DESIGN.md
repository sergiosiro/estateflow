---
name: Verdant Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#2b6954'
  on-secondary: '#ffffff'
  secondary-container: '#adedd3'
  on-secondary-container: '#306d58'
  tertiary: '#535f58'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b7770'
  on-tertiary-container: '#f5fff7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#d9e6dd'
  tertiary-fixed-dim: '#bdcac1'
  on-tertiary-fixed: '#131e19'
  on-tertiary-fixed-variant: '#3e4943'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin-desktop: 40px
  container-margin-mobile: 20px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system embodies a "High-End Tech-Naturalism" aesthetic. It targets professional environments where clarity, growth, and reliability are paramount. By blending **Corporate Modern** structures with a **Minimalist** ethos, the UI evokes a sense of calm authority and sustainable innovation.

The visual language focuses on precision through generous whitespace, high-quality typography, and a sophisticated green-centric palette. The emotional response should be one of "effortless competence"—the interface feels fresh and alive yet strictly disciplined.

## Colors
The palette shifts from legacy blues to a vibrant, professional green spectrum. 

- **Primary (#059669):** An active Emerald Green used for primary actions, success states, and key brand highlights. It is vibrant enough to feel modern but deep enough to maintain accessibility.
- **Secondary (#064e3b):** A deep Forest Green used for text emphasis, dark-mode headers, or high-contrast surfaces to ground the lighter greens.
- **Tertiary (#f0fdf4):** A Mint Wash used for large surface areas, containers, and backgrounds to create a soft, approachable environment.
- **Neutral (#1f2937):** A cool Slate Gray used for body text and borders to prevent the green from feeling overwhelming and to maintain professional gravitas.

Surface colors should prioritize the Tertiary Mint for subtle containment, while "Surface-Strong" elements utilize a white base with 1px borders in a 10% opacity version of the Primary Green.

## Typography
The typographic scale emphasizes a balance between the geometric friendliness of **Manrope** for headings and the systematic utility of **Inter** for long-form content. 

**JetBrains Mono** is introduced sparingly for labels and metadata to inject a technical, "pro-tool" feel. Headlines use tight letter-spacing to appear more impactful and "locked-in." For mobile, display sizes are aggressively reduced to ensure readability without excessive scrolling.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

The rhythm is governed by an 8px base unit. Component internal padding should favor "optical breathing room"—meaning horizontal padding is typically 1.5x the vertical padding (e.g., 8px top/bottom, 12px left/right). 

- **Desktop (1440px+):** 40px margins with 24px gutters.
- **Tablet (768px - 1439px):** 32px margins with 16px gutters.
- **Mobile (Up to 767px):** 20px margins with 12px gutters. Content typically reflows into a single column stack.

## Elevation & Depth
Depth is communicated through **Tonal Layering** supplemented by **Low-Contrast Outlines**. 

Instead of heavy black shadows, this design system uses soft, diffused shadows tinted with the primary color (e.g., a shadow with 4% opacity of #064e3b). This keeps the "green-based" theme cohesive. 

- **Level 0 (Base):** Tertiary Green (#f0fdf4).
- **Level 1 (Cards):** White surface with a 1px border (#059669 at 10% opacity).
- **Level 2 (Popovers/Modals):** White surface with a 12px blur shadow, 10% opacity green tint.
- **Interactive:** Elements "lift" on hover by increasing shadow spread and darkening the 1px border to 20% opacity.

## Shapes
A **Rounded** strategy is applied to soften the professional tone, making the interface feel modern and accessible. 

- Standard components (Inputs, Buttons) use **0.5rem (8px)**.
- Larger containers (Cards, Sections) use **1rem (16px)**.
- Specialized elements like "Status Chips" or "Search Bars" should use **rounded-xl (24px)** or full pill-shaping to distinguish them from actionable buttons.

## Components
- **Buttons:** Primary buttons use a solid #059669 fill with white text. Secondary buttons use the Tertiary Green background with Primary Green text. Avoid pure "Ghost" buttons; use a 1px Primary Green border for tertiary actions.
- **Chips:** Used for categorization. These should be pill-shaped with #f0fdf4 backgrounds and #064e3b text. 
- **Input Fields:** Use white backgrounds with an 8px radius. The focus state must replace the subtle border with a 2px #059669 stroke and a subtle outer glow.
- **Cards:** White surfaces with 16px corner radius. Use a vertical stack for content: Image/Icon, then Headline-SM, then Body-SM.
- **Lists:** Use 1px bottom borders (#059669 at 5% opacity). Interaction on list items is indicated by a subtle Tertiary Green background shift.
- **Progress Indicators:** Use the Primary Green for "Complete" and "Active" states, ensuring a high-contrast transition from the neutral track color.