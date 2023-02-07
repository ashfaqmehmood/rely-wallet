/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  primary: '#0D1F3C',
  secondary: '#A6A0BB',
  background: '#EDF1F9',
  text: '#485068',

  positive_01: 'rgba(68,208,88,1)', // Primary Positive, text, icons color
  positive_02: 'rgba(78,188,96,0.1)', // Secondary Positive, Supporting color for success illustrations
  positive_03: 'rgba(78,188,96,1)', // Lighter Positive, Supporting color for success illustrations
  negative_01: 'rgba(255,45,85,1)', // Primary Negative, text, icons color
  negative_02: 'rgba(255,45,85,0.1))', // Secondary Negative, Supporting color for errors illustrations
  warning_01: 'rgba(255, 202, 15, 1)',
  warning_02: 'rgba(255, 202, 15, 0.1)',
  interactive_01: 'rgba(67,96,223,1)', // Accent color, buttons, own message, actions,active state
  interactive_02: 'rgba(236,239,252,1)', // Light Accent, buttons background, actions background, messages
  interactive_03: 'rgba(255,255,255,0.1)', // Background for interactive above accent
  interactive_04: 'rgba(147,155,161,1)', // Disabled state
  ui_background: 'rgba(255,255,255,1)', // Default view background
  ui_01: 'rgba(238,242,245,1)', // Secondary background
  ui_02: 'rgba(0,0,0,0.1)', // Deviders
  ui_03: 'rgba(0,0,0,0.86)', // Dark background
  text_01: 'rgba(0,0,0,1)', // Main text color
  text_02: 'rgba(147,155,161,1)', // Secondary text
  text_03: 'rgba(255,255,255,0.7)', // Secondary on accent
  text_04: 'rgba(67,96,223,1)', // Links text color
  text_05: 'rgba(255,255,255,1)', // Text inverse on accent
  icon_01: 'rgba(0,0,0,1)', // Primary icons
  icon_02: 'rgba(147,155,161,1)', // Secondary icons
  icon_03: 'rgba(255,255,255,0.4)', // Secondary icons on accent bg
  icon_04: 'rgba(67,96,223,1)', // Interactive icon
  icon_05: 'rgba(255,255,255,1)', // Icons inverse on accent background
  shadow_01: 'rgba(0,9,26,0.12)', // Main shadow color
  backdrop: 'rgba(0,0,0,0.4)', // Backdrop for modals and bottom sheet
  border_01: 'rgba(238,242,245,1)',
  border_02: 'rgba(67, 96, 223, 0.1)',
  highlight: 'rgba(67,96,223,0.4)',
  blurred_bg: 'rgba(255,255,255,0.3)',
};

export const NavigationColors = {
  transparent: Colors.transparent,
  primary: Colors.primary,
  secondary: Colors.secondary,
  background: Colors.background,
  text: Colors.text,

  positive_01: Colors.positive_01,
  positive_02: Colors.positive_02,
  positive_03: Colors.positive_03,
  negative_01: Colors.negative_01,
  negative_02: Colors.negative_02,
  warning_01: Colors.warning_01,
  warning_02: Colors.warning_02,
  interactive_01: Colors.interactive_01,
  interactive_02: Colors.interactive_02,
  interactive_03: Colors.interactive_03,
  interactive_04: Colors.interactive_04,
  ui_background: Colors.ui_background,
  ui_01: Colors.ui_01,
  ui_02: Colors.ui_02,
  ui_03: Colors.ui_03,
  text_01: Colors.text_01,
  text_02: Colors.text_02,
  text_03: Colors.text_03,
  text_04: Colors.text_04,
  text_05: Colors.text_05,
  icon_01: Colors.icon_01,
  icon_02: Colors.icon_02,
  icon_03: Colors.icon_03,
  icon_04: Colors.icon_04,
  icon_05: Colors.icon_05,
  shadow_01: Colors.shadow_01,
  backdrop: Colors.backdrop,
  border_01: Colors.border_01,
  border_02: Colors.border_02,
  highlight: Colors.highlight,
  blurred_bg: Colors.blurred_bg,
};

/**
 * FontSize
 */
export const FontSize = {
  small: 16,
  regular: 20,
  large: 40,
};

/**
 * Metrics Sizes
 */
const tiny = 5; // 10
const small = tiny * 2; // 10
const regular = tiny * 3; // 15
const large = regular * 2; // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
};
