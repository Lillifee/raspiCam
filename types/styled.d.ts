import 'styled-components';

declare module 'styled-components' {
  /*
    Override the default theme properties of styled components.
  */
  export interface DefaultTheme {
    Name: string;

    RootBackground: string;

    LayerBackground: string;
    SubLayerBackground: string;

    Background: string;
    Border: string;

    Foreground: string;
    SubForeground: string;

    SelectedBackground: string;
    SelectedForeground: string;

    PrimaryBackground: string;
    PrimaryForeground: string;

    FontSize: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
    };
  }
}
