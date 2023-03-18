// theme provided by PATH DESIGN SYSTEM
// https://path-designsystem.elluciancloud.com/#/components/customization/custom-theming
import { createTheme } from '@mui/material/styles';
import { createBreakpoints } from '@mui/system';
import {
    colorBackgroundAlertDefault,
    colorBorderGlobalFocus,
    colorBrandPrimary,
    colorBrandSecondary,
    colorCtaBlueActive,
    colorCtaBlueBase,
    colorCtaBlueHover,
    colorCtaBlueTint,
    colorTextDisabled,
    colorTextNeutral100,
    colorTextPrimary,
    colorTextSecondary,
    colorBackgroundAlertError,
    colorBackgroundAlertNeutral,
    colorBackgroundAlertSuccess,
    colorBackgroundAlertWarning,
    colorBackgroundDefault,
    colorBrandCtaActive,
    colorBrandCtaBase,
    colorBrandCtaHover,
    colorBrandNeutral100,
    colorBrandNeutral200,
    colorBrandNeutral250,
    colorBrandNeutral300,
    colorBrandNeutral400,
    colorBrandNeutral500,
    colorBrandNeutral600,
    colorFillAlertError,
    colorFillAlertNeutral,
    colorFillAlertSuccess,
    colorFillAlertWarning,
    colorTextAlertDefault,
    colorTextAlertError,
    colorTextAlertNeutral,
    colorTextAlertSuccess,
    colorTextAlertWarning,
    fontSizeHeader1,
    fontSizeHeader1Small,
    fontSizeHeader2,
    fontSizeHeader2Small,
    fontSizeHeader3,
    fontSizeHeader3Small,
    fontSizeHeader4,
    fontSizeHeader4Small,
    fontSizeHeader5,
    fontSizeHeader5Small,
    fontSizeHeader6,
    fontSizeLarge,
    fontSizeSmall,
    fontSizeDefault,
    fontFamilyDefault,
    fontFamilyHeader,
    fontFamilyCondensed,
    fontWeightLight,
    fontWeightNormal,
    fontWeightBold,
    lineHeightDefault,
    sizingXxLarge1,
    zIndexTextFieldLabel,
    zIndexDrawer,
    zIndexDropdown,
    zIndexHeaderBarDropdown,
    zIndexMegaMenu,
    zIndexInlineAlert,
    zIndexPageAlert,
    zIndexActionMenu,
    zIndexHeaderBar,
    zIndexModal,
    zIndexBackdrop
} from '@ellucian/react-design-system/core/styles/tokens';

const palette = {
    primary: {
        main: colorBrandPrimary,
        contrastText: colorTextNeutral100
    },
    secondary: {
        main: colorBrandSecondary,
        contrastText: colorTextNeutral100
    },
    ctaColor: {
        base: colorCtaBlueBase,
        hover: colorCtaBlueHover,
        active: colorCtaBlueActive,
        tint: colorCtaBlueTint
    },
    disabled: {
        background: colorBrandNeutral400
    },
    focus: colorBorderGlobalFocus,
    status: {
        default: {
            text: colorTextAlertDefault,
            background: colorBackgroundAlertDefault
        },
        error: {
            text: colorTextAlertError,
            background: colorBackgroundAlertError,
            fill: colorFillAlertError
        },
        success: {
            text: colorTextAlertSuccess,
            background: colorBackgroundAlertSuccess,
            fill: colorFillAlertSuccess
        },
        neutral: {
            text: colorTextAlertNeutral,
            background: colorBackgroundAlertNeutral,
            fill: colorFillAlertNeutral
        },
        warning: {
            text: colorTextAlertWarning,
            background: colorBackgroundAlertWarning,
            fill: colorFillAlertWarning
        }
    },
    common: {
        black: colorBrandNeutral600,
        white: colorBrandNeutral100
    },
    text: {
        primary: colorTextPrimary,
        secondary: colorTextSecondary,
        disabled: colorTextDisabled,
        white: colorTextNeutral100
    },
    background: {
        default: colorBackgroundDefault
    },
    tertiary: {
        purple: {
            100: '#F8EEF6',
            200: '#ECCCE6',
            300: '#DFAAD6',
            400: '#D389C6',
            500: '#C667B6',
            600: '#BA46A6'
        },
        iris: {
            100: '#EEEEFA',
            200: '#CFCFF2',
            300: '#B0B0EA',
            400: '#9191E2',
            500: '#7272D9',
            600: '#5353D1'
        },
        fountain: {
            100: '#EFF7FF',
            200: '#CEE7FF',
            300: '#AFD8FF',
            400: '#90C9FF',
            500: '#70BAFF',
            600: '#51ABFF'
        },
        meadow: {
            100: '#E8F9F5',
            200: '#BFEDE2',
            300: '#96E2CF',
            400: '#6CD6BC',
            500: '#43CBA9',
            600: '#1ABF96'
        },
        kiwi: {
            100: '#F4FAEF',
            200: '#E1F2D3',
            300: '#CEEAB7',
            400: '#BBE29B',
            500: '#A8D97E',
            600: '#95D162'
        },
        saffron: {
            100: '#FDF9EA',
            200: '#FBEFC3',
            300: '#F8E59C',
            400: '#F5DB75',
            500: '#F2D14F',
            600: '#EFC728'
        },
        tangerine: {
            100: '#FFF4EB',
            200: '#FFDFC8',
            300: '#FFCAA4',
            400: '#FFB581',
            500: '#FFA15D',
            600: '#FF8C3A'
        }
    }
};

// Breakpoints must be defined in ascending order of viewport size. These breakpoints are used to calculate the size of the viewport in useWidth() hook.
// If values are "NOT" in ascending order then useWidth() hook will fail to return correct value.
const breakpoints = createBreakpoints({
    values: {
        xs: 0,
        sm: 480,
        md: 768,
        lg: 992,
        xl: 1920
    }
});

const lightThemeOptions = {
    mode: 'light',
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: colorBrandNeutral500,
                    '&.Mui-disabled:hover': {
                        cursor: 'not-allowed'
                    },
                    '&.Mui-error': {
                        color: colorBrandNeutral500
                    },
                    '&.Mui-focused': {
                        color: colorBrandNeutral500
                    }
                },
                asterisk: {
                    '&.Mui-error': {
                        color: colorBrandNeutral500
                    }
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                formControl: {
                    'label + &': {
                        marginTop: 0,
                        width: '100%'
                    }
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        color: colorBrandNeutral100
                    },
                    '&.Mui-selected': {
                        color: colorBrandNeutral100
                    }
                }
            }
        }
    },
    breakpoints,
    mixins: {
        toolbar: {
            minHeight: sizingXxLarge1,
            [`${breakpoints.up('xs')} and (orientation: landscape)`]: {
                minHeight: sizingXxLarge1
            },
            [breakpoints.up('sm')]: {
                minHeight: sizingXxLarge1
            }
        }
    },
    palette: {
        action: {
            active: colorBrandCtaActive,
            hover: colorBrandCtaHover,
            base: colorBrandCtaBase,
            disabled: colorBrandNeutral400
        },
        grey: {
            100: colorBrandNeutral100,
            200: colorBrandNeutral200,
            250: colorBrandNeutral250,
            300: colorBrandNeutral300,
            400: colorBrandNeutral400,
            500: colorBrandNeutral500,
            600: colorBrandNeutral600
        },
        default: {
            main: colorBackgroundAlertDefault,
            light: '#E9E9E9',
            dark: '#D9D9D9',
            contrastText: colorTextAlertDefault
        },
        error: {
            main: colorBackgroundAlertError,
            light: colorFillAlertError,
            dark: colorFillAlertError,
            contrastText: colorTextAlertError
        },
        success: {
            main: colorBackgroundAlertSuccess,
            light: colorFillAlertSuccess,
            dark: colorFillAlertSuccess,
            contrastText: colorTextAlertSuccess
        },
        info: {
            main: colorBackgroundAlertNeutral,
            light: colorFillAlertNeutral,
            dark: colorFillAlertNeutral,
            contrastText: colorTextAlertNeutral
        },
        warning: {
            main: colorBackgroundAlertWarning,
            light: colorFillAlertWarning,
            dark: colorFillAlertWarning,
            contrastText: colorTextAlertWarning
        },
        ...palette
    },
    spacing: 4,
    typography: {
        fontFamily: fontFamilyDefault,
        fontSize: 14,
        fontWeightLight: fontWeightLight,
        fontWeightRegular: fontWeightNormal,
        fontWeightBold: fontWeightBold,
        h1: {
            fontFamily: fontFamilyHeader,
            fontSize: fontSizeHeader1,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: '0.03125rem',
            [breakpoints.down('md')]: {
                fontSize: fontSizeHeader1Small
            }
        },
        h2: {
            fontFamily: fontFamilyHeader,
            fontSize: fontSizeHeader2,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: '0.03125rem',
            [breakpoints.down('md')]: {
                fontSize: fontSizeHeader2Small
            }
        },
        h3: {
            fontFamily: fontFamilyHeader,
            fontSize: fontSizeHeader3,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            letterSpacing: '0.03125rem',
            wordSpacing: '0.16em',
            [breakpoints.down('md')]: {
                fontSize: fontSizeHeader3Small
            }
        },
        h4: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeHeader4,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            [breakpoints.down('md')]: {
                fontSize: fontSizeHeader4Small
            }
        },
        h5: {
            fontFamily: fontFamilyDefault,
            fontWeight: fontWeightBold,
            fontSize: fontSizeHeader5,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            [breakpoints.down('md')]: {
                fontSize: fontSizeHeader5Small
            }
        },
        h6: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeHeader6,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em'
        },
        subtitle1: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeHeader5,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em'
        },
        subtitle2: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeHeader6,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em'
        },
        body1: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeLarge,
            fontWeight: fontWeightNormal,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em'
        },
        body2: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeDefault,
            fontWeight: fontWeightNormal,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em'
        },
        body3: {
            fontFamily: fontFamilyDefault,
            fontSize: fontSizeSmall,
            fontWeight: fontWeightNormal,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: 'initial',
            textTransform: 'initial'
        },
        button: {
            fontFamily: fontFamilyCondensed,
            fontSize: fontSizeLarge,
            fontWeight: fontWeightBold,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: '0.0625rem',
            textTransform: 'uppercase'
        },
        caption: {
            fontFamily: fontFamilyCondensed,
            fontSize: fontSizeDefault,
            fontWeight: fontWeightNormal,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: '0.0625rem',
            textTransform: 'uppercase'
        },
        overline: {
            // set to caption styles in case anyone uses this
            fontFamily: fontFamilyCondensed,
            fontSize: fontSizeDefault,
            fontWeight: fontWeightNormal,
            lineHeight: lineHeightDefault,
            wordSpacing: '0.16em',
            letterSpacing: '0.0625rem',
            textTransform: 'uppercase'
        }
    },
    zIndex: {
        textFieldLabel: zIndexTextFieldLabel,
        dropdown: zIndexDropdown,
        headerBarDropdown: zIndexHeaderBarDropdown,
        actionMenu: zIndexActionMenu,
        megaMenu: zIndexMegaMenu,
        inlineAlert: zIndexInlineAlert,
        pageAlert: zIndexPageAlert,
        headerBar: zIndexHeaderBar,
        modal: zIndexModal,
        drawer: zIndexDrawer,
        backdrop: zIndexBackdrop
    }
};

const lightTheme = createTheme(lightThemeOptions);

export { lightTheme as default, lightThemeOptions };
