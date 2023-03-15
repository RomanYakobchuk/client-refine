import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {
    useGetIdentity,
    useGetLocale,
    useSetLocale,
} from "@refinedev/core";
import {
    AppBar,
    IconButton,
    Avatar,
    Stack,
    FormControl,
    MenuItem,
    Select,
    Toolbar,
    Typography, SelectChangeEvent,
} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined} from "@mui/icons-material";

import {ColorModeContext} from "contexts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {ProfileProps} from "../../../interfaces/common";

export const Header: React.FC = () => {
    const {mode, setMode} = useContext(ColorModeContext);

    const {i18n} = useTranslation();
    const changeLanguage = useSetLocale();
    const navigate = useNavigate();
    const locale = useGetLocale();
    const currentLocale = locale();

    const {data: user} = useGetIdentity<ProfileProps>();

    const showUserInfo = user && (user.name || user.avatar);
    const [lan, setLan] = useState<any>(currentLocale);
    const handleChange = (event: SelectChangeEvent) => {
        setLan(event.target.value as string);
    };
    useEffect(() => {
        if (lan) {
            changeLanguage(lan ?? currentLocale)
        }
    }, [lan, currentLocale])

    return (
        <AppBar color="default" position="sticky" elevation={1}>
            <Toolbar>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <IconButton
                        onClick={() => {
                            setMode();
                        }}
                    >
                        {mode === "dark" ? <LightModeOutlined color={"warning"}/> : <DarkModeOutlined/>}
                    </IconButton>
                    <FormControl sx={{m: 1, display: 'flex', minWidth: {xs: '50px', sm: 120}}}>
                        <Select
                            disableUnderline
                            inputProps={{"aria-label": "Without label"}}
                            variant="standard"
                            sx={{
                                display: 'flex'
                            }}
                            value={lan ?? currentLocale}
                            onChange={handleChange}
                        >
                            {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                                <MenuItem
                                    selected={currentLocale === lang}
                                    key={lang}
                                    value={lang ?? ""}
                                    sx={{
                                        display: 'flex'
                                    }}
                                >
                                    <Stack
                                        display={"flex"}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Avatar
                                            sx={{
                                                display: 'flex',
                                                width: "16px",
                                                height: "16px",
                                                marginRight: "5px",
                                            }}
                                            src={`/images/flags/${lang}.svg`}
                                        />
                                        <Typography component={"span"} sx={{
                                            display: {xs: "none", sm: 'flex'},
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            {lang === "ua" ? "Українська" : "English"}
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {showUserInfo && (
                        <Stack direction="row" sx={{
                            cursor: 'pointer',
                            p: '5px',
                            borderRadius: '5px',
                            transition: '300ms linear',
                            "&:hover": {
                                boxShadow: mode === "dark" ? "0px 0px 10px 10px #16181b" : "0px 0px 10px 10px #e9ebec"
                            }
                        }} gap="16px" alignItems="center" onClick={() => navigate('/profile')}>
                            {user.avatar && <Avatar src={user?.avatar} alt={user?.name}/>}
                            {user.name && (
                                <Typography variant="subtitle2">{user?.name}</Typography>
                            )}
                        </Stack>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
