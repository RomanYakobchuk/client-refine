import {Header} from "../../components/layout";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../contexts";
import {FieldValues} from "react-hook-form";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate} from "react-router-dom";
import {CustomButton} from "../../components";


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

const ForgotPassword = () => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {open} = useNotification();
    const [error, setError] = useState<any>([]);

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/forgotPassword',
            onMutationError: (data, variables, context) => {
                setError(data?.response?.data)
            },
        }
    },);
    const onFinishHandler = async (date: FieldValues) => {
        if (!date?.email) return alert(translate("pages.forgotPassword.errors.validEmail"))
        await onFinish({
            email: date?.email
        });

    };
    useEffect(() => {
        if (error?.error && error?.code === 400) {
            open?.({
                type: "error",
                message: translate("pages.forgotPassword.errors.validEmail"),
                description: "Wrong",
                key: "unique-id",
            });
        }
    }, [error])
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
                    <Avatar src={`/images/logo.png`} onClick={() => navigate('/')} sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                        {translate("pages.forgotPassword.title")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            minRows={5}
                            fullWidth
                            id="email"
                            // onChange={(e: ChangeEvent<HTMLInputElement>)=>setCode(e.target.value)}
                            label={translate("pages.forgotPassword.fields.email")}
                            {...register('email', {required: true})}
                            autoComplete="code"
                            autoFocus
                        />
                        <Grid container mt={4} flexDirection={"column"} gap={2}>
                            <CustomButton
                                type={"submit"}
                                color={"#fcfcfc"}
                                title={
                                    formLoading ?
                                        <CircularProgress/> :
                                        translate("pages.forgotPassword.buttons.submit")
                                }
                                backgroundColor={"cornflowerblue"}
                                fullWidth
                            />
                            <CustomButton
                                color={"#fcfcfc"}
                                handleClick={() => navigate('/login')}
                                title={translate("pages.register.buttons.haveAccount") + translate("pages.login.signin")}
                                backgroundColor={mode === "dark" ? "#78a6c8" : "#326789"}
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

export default ForgotPassword;