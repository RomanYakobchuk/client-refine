import {Header} from "../../components/layout";
import {
    Avatar,
    Box,
    CircularProgress,
    Container,
    CssBaseline, FormControl, Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../contexts";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {parseJwt} from "../../utils/parse-jwt"
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import {CustomButton} from "../../components";
import {FieldValues} from "react-hook-form";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const UpdatePassword = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {open} = useNotification();
    const {token}:any = useParams();
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const dateNow = new Date();
    const data_token = parseJwt(token);
    useEffect(() => {
        if(data_token.exp * 1000 < dateNow.getTime()){
            open?.({
                type: "error",
                message: translate("pages.updatePassword.errors.timeIsUp"),
                description: "Wrong",
                key: "unique-id",
            });
            navigate('/update-password')
        }
    }, [data_token, dateNow])
    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/updatePassword',
        }
    },);

    useEffect(() => {
        if(!token) {
            navigate("/")
        }
    }, [token])

    const onFinishHandler = async (date: FieldValues) => {
        if (date?.password !== date?.confirmPassword) return alert(translate("pages.updatePassword.errors.confirmPasswordNotMatch"))
        await onFinish({
            email: data_token?.email,
            password: date?.password,
            token
        });

    };

    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }
    const handleShowConfirmPass = () => {
        showConfirmPass ? setShowConfirmPass(false) : setShowConfirmPass(true)
    }
    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            minHeight: '100vh',
            bgcolor: mode === "dark" ? "#173d4f" : '#E9EEF2',
        }}>
            <Header/>
            <Container component="main" maxWidth="xs" sx={{
                bgcolor: 'transparent'
            }}>
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar src={`/images/logo.png`} onClick={()=>navigate('/')} sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5">
                        {translate("pages.updatePassword.title")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                        <FormControl fullWidth sx={{
                            position: 'relative'
                        }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                inputProps={{pattern: "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$/"}}
                                {...register("password", {required: true})}
                                label={translate("pages.login.fields.password")}
                                type={showPass ? 'text' : 'password'}
                                sx={{
                                    borderColor: "cornflowerblue"
                                }}
                                id="password"
                                placeholder={"Example: Thsd_e28gv"}
                                autoComplete="current-password"
                            />
                            <Box sx={{
                                cursor: 'pointer',
                                position: 'absolute',
                                zIndex: 20,
                                top: '45%',
                                right: '5%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                "&:hover": {
                                    color: 'cornflowerblue'
                                }
                            }}>
                                {
                                    showPass ?
                                        <VisibilityOffOutlined onClick={handleShowPass}/> :
                                        <VisibilityOutlined onClick={handleShowPass}/>
                                }
                            </Box>
                        </FormControl>
                        <FormControl fullWidth sx={{
                            position: 'relative'
                        }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                inputProps={{pattern: "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$/"}}
                                {...register("confirmPassword", {required: true})}
                                label={translate("pages.updatePassword.fields.confirmPassword")}
                                type={showConfirmPass ? 'text' : 'password'}
                                sx={{
                                    borderColor: "cornflowerblue"
                                }}
                                id="confirmPassword"
                                placeholder={"Example: Thsd_e28gv"}
                                autoComplete="current-password"
                            />
                            <Box sx={{
                                cursor: 'pointer',
                                position: 'absolute',
                                zIndex: 20,
                                top: '45%',
                                right: '5%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                "&:hover": {
                                    color: 'cornflowerblue'
                                }
                            }}>
                                {
                                    showConfirmPass ?
                                        <VisibilityOffOutlined onClick={handleShowConfirmPass}/> :
                                        <VisibilityOutlined onClick={handleShowConfirmPass}/>
                                }
                            </Box>
                        </FormControl>
                        <Grid item mt={2} mb={2}>
                            <CustomButton
                                type={"submit"}
                                color={"#fcfcfc"}
                                title={
                                    formLoading ?
                                        <CircularProgress/> :
                                        translate("pages.updatePassword.buttons.submit")
                                }
                                backgroundColor={"cornflowerblue"}
                                fullWidth
                            />
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </Box>
    );
};

export default UpdatePassword;