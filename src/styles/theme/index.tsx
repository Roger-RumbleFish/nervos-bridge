import React from 'react'

import {
  createGenerateClassName,
  createTheme,
  CssBaseline,
  StylesProvider,
} from '@material-ui/core'
import MUIThemeProvider from '@material-ui/styles/ThemeProvider'

import InterBold from '../fonts/inter/Inter-Bold.woff2'
import InterLight from '../fonts/inter/Inter-Light.woff2'
import InterMedium from '../fonts/inter/Inter-Medium.woff2'
import InterRegular from '../fonts/inter/Inter-Regular.woff2'
import InterSemiBold from '../fonts/inter/Inter-SemiBold.woff2'

export const amaranth = '#F03D52'
export const outrageousOrange = '#FF6C42'
export const tuna = '#30313E'
export const downriver = '#0A2540'
export const textDisabled = '#9AA5B0'
export const blueBayoux = '#526578'

export const white = '#ffffff'
export const porcelain = '#F7F8F9'
export const grayishBlue = '#CECED5'
export const lightGray = '#E0E0E0'

export const green = '#2A9C58'

const theme = createTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiCheckbox: {
      disableRipple: true,
    },
    MuiRadio: {
      disableRipple: true,
    },
  },
  palette: {
    primary: {
      main: amaranth,
    },
    secondary: {
      main: outrageousOrange,
    },
    text: {
      primary: downriver,
      secondary: blueBayoux,
    },
    error: {
      main: amaranth,
    },
    background: {
      default: porcelain,
      paper: white,
    },
    common: {
      white: white,
    },
  },
  typography: {
    fontFamily: ['Inter', 'Robot'].join(','),
    h1: {
      fontSize: 48,
      lineHeight: '56px',
      fontWeight: 700,
    },
    h2: {
      fontSize: 34,
      lineHeight: '42px',
      fontWeight: 700,
    },
    h3: {
      fontSize: 24,
      lineHeight: '32px',
      fontWeight: 500,
    },
    h4: {
      fontSize: 20,
      lineHeight: '26px',
      fontWeight: 500,
    },
    h5: {
      fontSize: 18,
      fontWeight: 500,
    },
    h6: {
      fontSize: 16,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: '24px',
    },
    subtitle2: {
      fontSize: 18,
      fontWeight: 600,
      lineHeight: '24px',
    },
    body1: {
      fontSize: 15,
      lineHeight: '22px',
      fontWeight: 400,
    },
    body2: {
      fontSize: 15,
      lineHeight: '22px',
      fontWeight: 600,
    },
    button: {
      fontSize: 13,
      lineHeight: '16px',
      fontWeight: 600,
    },
    caption: {
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
    },
    overline: {
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 700,
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        fontSize: 16,
        color: tuna,
      },
    },
    MuiOutlinedInput: {
      root: {
        '&$focused .MuiOutlinedInput-notchedOutline': {
          borderColor: blueBayoux,
          borderWidth: '1px',
        },
      },
    },
    MuiButton: {
      root: {
        height: 48,
      },
    },
    MuiRadio: {
      root: {
        '& .MuiSvgIcon-root': {
          height: 32,
          width: 32,
        },
      },
    },
    MuiAppBar: {
      root: {
        height: 72,
      },
      colorPrimary: {
        backgroundColor: white,
        boxShadow: `0px 4px 4px ${lightGray}`,
      },
    },
    MuiPaper: {
      root: {
        border: `1px solid ${lightGray}`,
      },
      rounded: {
        borderRadius: 8,
      },
      elevation1: {
        boxShadow: `0px 4px 4px ${lightGray}`,
      },
      elevation20: {
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.05)',
      },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 300,
            src: `
            local('Inter'),
            local('Inter-Light'),
            url(${InterLight}) format('woff2')
            `,
          },
          {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 400,
            src: `
            local('Inter'),
            local('Inter-Regular'),
            url(${InterRegular}) format('woff2')
            `,
          },
          {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 500,
            src: `
            local('Inter'),
            local('Inter-Medium'),
            url(${InterMedium}) format('woff2')
          `,
          },
          {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 600,
            src: `
            local('Inter'),
            local('Inter-SemiBold'),
            url(${InterSemiBold}) format('woff2')
            `,
          },
          {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 700,
            src: `
            local('Inter'),
            local('Inter-Bold'),
            url(${InterBold}) format('woff2')
            `,
          },
        ],
      },
    },
  },
})

const generateClassName = createGenerateClassName({
  seed: 'bridge',
  disableGlobal: true,
})

export const ThemeProvider: React.FC = ({ children }) => (
  <StylesProvider generateClassName={generateClassName} injectFirst>
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  </StylesProvider>
)
