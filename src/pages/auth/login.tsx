import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Avatar,
    Button,
    TextField,
    CssBaseline,
    FormControl, CircularProgress
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";

import {useLogin, useTranslate} from "@refinedev/core";
import {IData} from "../../interfaces/common";

import {Header} from "../../components/layout";
import {VisibilityOffOutlined, VisibilityOutlined} from "@mui/icons-material";
import {ColorModeContext} from "../../contexts";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate} from "react-router-dom";
import {FieldValues} from "react-hook-form";
import {useNotification} from "@refinedev/core";
import {axiosInstance} from "../../authProvider";
import {CustomButton} from "../../components";
import {parseJwt} from "../../utils/parse-jwt";


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


const Login = () => {

    const translate = useTranslate();
    const [showPass, setShowPass] = useState(false);
    const [showActiveAcc, setShowActiveAcc] = useState(false);
    const {mode} = useContext(ColorModeContext);
    const [error, setError] = useState<any>([])
    const navigate = useNavigate();

    const {open} = useNotification();

    const {mutate: login} = useLogin<IData>()

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit
    } = useForm({
        refineCoreProps: {
            resource: 'auth/login',
            onMutationError: (data, variables, context) => {
                setError(data?.response?.data)
            },
        }
    },);

    const onFinishHandler = async (date: FieldValues) => {
        if (!date.email || !date.password) return alert(translate("pages.login.notHave"))
        const {data}: IData | any = await onFinish({
            ...date
        });
        const user = data?.user ? parseJwt(data?.user) : null
        if (user?.isActivated) {
            login(data)
        }
    };


    useEffect(() => {
        if (error?.error && error?.code === 423) {
            setShowActiveAcc(true)
        } else if (error?.code === 400) {
            open?.({
                type: "error",
                message: `${error?.error}`,
                description: "Wrong",
                key: "unique-id",
            });
        } else {
            setShowActiveAcc(false)
        }
    }, [error])

    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }
    const ActivateAccount = async (data: FieldValues) => {
        if (!data?.email) return alert(translate("pages.login.notHaveAct"))
        await axiosInstance.post("/auth/activate", {
            email: data?.email
        })
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
                    <Avatar src={`/images/logo.png`} onClick={() => navigate('/')} sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5" fontSize={{xs: 18, md: 22}}>
                        {translate("pages.login.title")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            size={"small"}
                            fullWidth
                            id="email"
                            label={translate("pages.login.fields.email")}
                            {...register("email", {required: true})}
                            autoComplete="email"
                            autoFocus
                        />
                        <FormControl fullWidth sx={{
                            position: 'relative'
                        }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                size={"small"}
                                {...register("password", {required: true})}
                                label={translate("pages.login.fields.password")}
                                type={showPass ? 'text' : 'password'}
                                sx={{
                                    borderColor: "cornflowerblue"
                                }}
                                id="password"
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
                        {
                            showActiveAcc &&
                            <div>
                                <Typography>
                                    {translate("pages.login.errors.active")}
                                </Typography>
                                <Button fullWidth variant={"outlined"} onClick={handleSubmit(ActivateAccount)}>
                                    {translate("pages.login.activate")}
                                </Button>
                            </div>
                        }
                        <Grid item mt={2} mb={2}>
                            <CustomButton
                                type={"submit"}
                                color={"#fcfcfc"}
                                title={
                                    formLoading ?
                                        <CircularProgress/> :
                                        translate("pages.login.buttons.submit")}
                                backgroundColor={"cornflowerblue"}
                                fullWidth
                            />
                        </Grid>
                        <Grid container sx={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <CustomButton
                                color={"#fcfcfc"}
                                title={translate("pages.login.buttons.forgotPassword")}
                                backgroundColor={mode === "dark" ? "#5689c0" : "#244d61"}
                                width={"35%"}
                                handleClick={() => navigate('/forgot-password')}
                            />
                            <CustomButton
                                color={"#fcfcfc"}
                                handleClick={() => navigate('/register')}
                                title={translate("pages.login.buttons.noAccount") + translate("pages.login.signup")}
                                backgroundColor={mode === "dark" ? "#78a6c8" : "#326789"}
                                width={"60%"}
                            />
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </Box>
    );
}
export default Login;
