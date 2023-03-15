import React, {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import { DarkTheme, LightTheme } from "@refinedev/mui";
import {createTheme} from "@mui/material";

type ColorModeContextType = {
    mode: string;
    setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
    {} as ColorModeContextType
);


export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
                                                                          children,
                                                                      }) => {
    const colorModeFromLocalStorage = localStorage.getItem("colorMode");
    const isSystemPreferenceDark = window?.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const systemPreference = isSystemPreferenceDark ? "dark" : "light";
    const [mode, setMode] = useState(
        colorModeFromLocalStorage || systemPreference
    );

    useEffect(() => {
        window.localStorage.setItem("colorMode", mode);
    }, [mode]);

    const setColorMode = () => {
        if (mode === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    };
    let customLightTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: "#67be23",
                contrastText: "#fff",
            },
            secondary: {
                main: "#2A132E",
                contrastText: "#fff",
            },
            background: {
                default: "#e6e4e4",
                paper: "#f5f1ee",
            },
            success: {
                main: "#67be23",
                contrastText: "#fff",
            },
            error: {
                main: "#fa541c",
                contrastText: "#fff",
            },
            warning: {
                main: "#fa8c16",
                contrastText: "#fff",
            },
            info: {
                main: "#664f4f",
                contrastText: "#fff",
            },
            divider: "rgba(0,0,0,0)",
            text: {
                primary: "#626262",
                secondary: "#9f9f9f",
                disabled: "#c1c1c1",
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    colorDefault: {
                        backgroundColor: "#fff",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage:
                            "linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01))",
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    h5: {
                        fontWeight: 800,
                        lineHeight: "2rem",
                    },
                },
            },
        }
    });
    let customDarkTheme = createTheme({
        palette: {
            mode:'dark',
            primary: {
                main: "#67be23",
                contrastText: "#fff",
            },
            secondary: {
                main: "#58626c",
                contrastText: "#fff",
            },
            background: {
                default: "#948888",
                paper: "#58626c",
            },
            success: {
                main: "#67be23",
                contrastText: "#fff",
            },
            error: {
                main: "#ee2a1e",
                contrastText: "#fff",
            },
            warning: {
                main: "#fa8c16",
                contrastText: "#fff",
            },
            info: {
                main: "#5d818f",
                contrastText: "#fff",
            },
            divider: "rgba(173,215,211,0)",
            text: {
                primary: "#fff",
                secondary: "rgba(255,255,255,0.7)",
                disabled: "#d1d1d1",
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage:
                            "linear-gradient(rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.025))",
                    },
                },
            },
            MuiAppBar: {
                defaultProps: {
                    color: "default",
                },
            },
            MuiTypography: {
                styleOverrides: {
                    h5: {
                        fontWeight: 800,
                        lineHeight: "2rem",
                    },
                },
            },
        },
    });

    return (
        <ColorModeContext.Provider
            value={{
                setMode: setColorMode,
                mode,
            }}
        >
            <ThemeProvider theme={mode === "light" ? customLightTheme : customDarkTheme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
