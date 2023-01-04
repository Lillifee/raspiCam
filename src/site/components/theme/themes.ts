import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  Name: 'dark',

  RootBackground: '#242424',

  LayerBackground: 'rgba(20, 20, 20, 0.8)',
  SubLayerBackground: 'rgba(20, 20, 20, 0.6)',

  Background: '#242424',
  Border: '#1d1d1d',

  Foreground: '#e2e2e2',
  SubForeground: '#a2a2a2',

  SelectedBackground: '#323232',
  SelectedForeground: '#e2e2e2',

  PrimaryBackground: '#78b956',
  PrimaryForeground: '#1d1d1d',

  FontSize: {
    xs: '0.7em',
    s: '0.8em',
    m: '1em',
    l: '1.5em',
    xl: '2em',
  },
};

export const lightTheme: DefaultTheme = {
  Name: 'light',

  RootBackground: '#ffffff',
  LayerBackground: 'rgba(255, 255, 255, 0.8)',
  SubLayerBackground: 'rgba(255, 255, 255, 0.6)',

  Background: '#dfdfdf',
  Border: '#383838',

  Foreground: '#3c3c3c',
  SubForeground: '#7c7c7c',

  SelectedBackground: '#ebebeb',
  SelectedForeground: '#3c3c3c',

  PrimaryBackground: '#78b956',
  PrimaryForeground: '#1d1d1d',

  FontSize: {
    xs: '0.7em',
    s: '0.8em',
    m: '1em',
    l: '1.5em',
    xl: '2em',
  },
};

export const allThemes: Record<string, DefaultTheme> = {
  dark: darkTheme,
  light: lightTheme,
};
