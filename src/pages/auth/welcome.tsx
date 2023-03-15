import {Header} from "../../components/layout";
import {Avatar, Box, Button, Container, CssBaseline, Typography} from "@mui/material";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../contexts";
import {useNavigate} from "react-router-dom";


const Welcome = () => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: '100vh',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" sx={{
                bgcolor: 'transparent'
            }}>
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: "start",
                        flexDirection: {xs: "column", md: 'row'},
                        alignItems: 'start',
                        gap: {xs: 2, md: 10},
                        flexWrap: 'wrap',
                    }}>
                        <Typography sx={{
                            fontSize: {xs: 30, md: 40},
                            fontWeight: 400
                        }}>
                            {translate("welcomePage.title")}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: "center",
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                            <Avatar src={'/images/logo.png'}/>
                            <Typography sx={{
                                fontSize: {xs: 30, md: 40},
                                fontWeight: 700
                            }}>
                                Capl
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        mt: 10
                    }}>
                        <Typography sx={{
                            fontSize: {xs: 16, md: 20},
                            maxWidth: {xs: '90%', sm: "70%"},

                        }}>
                            {translate("welcomePage.text")}
                        </Typography>
                    </Box>
                    <Box sx={{
                        mt: 6,
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        gap: {xs: 2, sm: 4},
                        alignItems: {xs: 'start', sm: 'center'}
                    }}>
                        <Typography sx={{
                            fontSize: {xs: 16, md: 20},
                            maxWidth: {xs: '90%', sm: "70%"},
                        }}>
                            {translate("welcomePage.text2")}
                        </Typography>
                        <Button onClick={()=>navigate('/register')}
                            color={mode === "dark" ? "info" : "secondary"} variant={"contained"} sx={{
                            padding: '5px 10px',
                            height: {xs: '40px', md: '60px'},
                            width: '200px'
                        }}>
                            {translate("pages.login.signup")}
                        </Button>
                    </Box>
                    <Box sx={{
                        mt: 6,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: {xs: 2, sm: 4},
                        alignItems: 'center'
                    }}>
                        <Typography sx={{
                            fontSize: {xs: 16, md: 20},
                            maxWidth: "70%",
                        }}>
                            {translate("welcomePage.question")}
                        </Typography>
                        <Button onClick={()=>navigate('/login')} variant={"contained"} color={mode === "dark" ? "info" : "secondary"} sx={{
                            padding: '5px 10px',
                            height: {xs: '40px', md: '60px'},
                            width: '150px'
                        }}>
                            {translate("pages.login.signin")}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Welcome;