import 'styled-components';

declare module 'styled-components' {
  /*
    Override the default theme properties of styled components.
  */
  export interface DefaultTheme {
    Background: string;
    Foreground: string;
    Border: string;

    SubBackground: string;
    SubForeground: string;
    SubBorder: string;

    HighlightBackground: string;
    HighlightForeground: string;

    SelectedBackground: string;
    SelectedForeground: string;

    PrimaryBackground: string;
    PrimaryForeground: string;
  }
}
