import Variables from './Variables'
import { DefaultVariables, Fonts, Gutters, Images, Layout } from './index'

export type ThemeVariables = {
  Colors: typeof Variables.Colors
  NavigationColors: typeof Variables.NavigationColors
  FontSize: typeof Variables.FontSize
  MetricsSizes: typeof Variables.MetricsSizes
}

export type Theme<F, G, I, L, C> = ThemeVariables & {
  Fonts: F
  Gutters: G
  Images: I
  Layout: L
  Common: C
  Variables?: Partial<ThemeVariables>
}

export type ThemeNavigationColors = {
  transparent: string,
  primary: string,
  secondary: string,
  background: string,
  text: string,

  positive_01: string
  positive_02: string
  positive_03: string
  negative_01: string
  negative_02: string
  warning_01: string
  warning_02: string
  interactive_01: string
  interactive_02: string
  interactive_03: string
  interactive_04: string
  ui_background: string
  ui_01: string
  ui_02: string
  ui_03: string
  text_01: string
  text_02: string
  text_03: string
  text_04: string
  text_05: string
  icon_01: string
  icon_02: string
  icon_03: string
  icon_04: string
  icon_05: string
  shadow_01: string
  backdrop: string
  border_01: string
  border_02: string
  highlight: string
  blurred_bg: string
}

export type ThemeNavigationTheme = {
  dark: boolean
  colors: ThemeNavigationColors
}

const fonts = Fonts(DefaultVariables)
const gutters = Gutters(DefaultVariables)
const images = Images(DefaultVariables)
const layout = Layout(DefaultVariables)

export type CommonParams<C> = ThemeVariables &
  Pick<
    Theme<typeof fonts, typeof gutters, typeof images, typeof layout, C>,
    'Layout' | 'Gutters' | 'Fonts' | 'Images'
  >
