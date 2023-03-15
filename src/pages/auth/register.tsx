import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Checkbox,
    Avatar,
    Button,
    TextField,
    CssBaseline,
    FormControl, CircularProgress
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {FieldValues} from "react-hook-form";
import {useNotification, useTranslate} from "@refinedev/core";

import {
    ErrorOutlineOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import {Header} from "../../components/layout";
import UserAgreement from "../../components/userAgreement";
import {useForm} from "@refinedev/react-hook-form";
import {ColorModeContext} from "../../contexts";
import {useNavigate} from "react-router-dom";
import {CustomButton, ModalWindow} from "../../components";


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

const Register = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();

    const [show, setShow] = useState(false);
    const [error, setError] = useState<any>([]);
    const [accept, setAccept] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/register',
            onMutationError: (data, variables, context) => {
                setError(data?.response?.data)
            },
            redirect: false
        }
    },);


    const onFinishHandler = async (data: FieldValues) => {
        if (!accept) return alert(translate("agreement.alert"));

        if (data?.dOB > (new Date().getFullYear() - 18)) {
            return alert(translate("account.edit.alert"))
        }

        const res = await onFinish({
            ...data
        });

        // localStorage.setItem('IdForVerify', JSON.stringify(res?.data?.id))
        setOpenModal(true)

    };

    useEffect(() => {
        if (error?.error && error?.code === 409) {
            open?.({
                type: "error",
                message: `${error?.error}`,
                description: "Wrong",
                key: "unique-id",
            });
        }
    }, [error])
    const handleShowPass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
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
                        {translate("pages.register.title")}
                    </Typography>
                    <Typography component={"h3"}>
                        {translate("importantText")}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onFinishHandler)} noValidate sx={{mt: 3}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    required
                                    fullWidth
                                    size={"small"}
                                    id="name"
                                    label={translate("pages.register.fields.name")}
                                    autoFocus
                                    {...register('name', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phone"
                                    size={"small"}
                                    label={translate("pages.register.fields.phone")}
                                    defaultValue={'+380'}
                                    inputProps={{pattern: "/\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\\w{1,10}\\s?\\d{1,6})?/"}}
                                    autoComplete="family-name"
                                    {...register('phone', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    size={"small"}
                                    inputProps={{pattern: "/^([^.@]+)(\\.[^.@]+)*@([^.@]+\\.)+([^.@]+)$/"}}
                                    label={translate("pages.register.fields.email")}
                                    type={"email"}
                                    {...register('email', {required: true})}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                           required
                                           id="outlined-basic"
                                           color="info"
                                           size={"small"}
                                           type={"date"}
                                           inputProps={{}}
                                           defaultValue={"2000-01-01"}
                                           label={translate("pages.register.fields.dOB")}
                                           variant="outlined"
                                           {...register('dOB', {required: true})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{
                                    position: 'relative'
                                }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        size={"small"}
                                        label={translate("pages.login.fields.password")}
                                        type={showPass ? 'text' : 'password'}
                                        sx={{
                                            borderColor: "cornflowerblue"
                                        }}
                                        id="password"
                                        placeholder={"Example: Thsd_e28gv"}
                                        inputProps={{pattern: "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$/"}}
                                        {...register('password', {required: true})}
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
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'start'
                                }}>
                                    <Checkbox checked={accept} value="allowExtraEmails"
                                              onChange={(e: ChangeEvent<HTMLInputElement>) => setAccept(e.target.checked)}
                                              color="primary" required/>
                                    <Typography sx={{
                                        cursor: 'pointer',
                                        "&:hover": {
                                            color: 'cornflowerblue'
                                        },
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        alignItems: 'center'
                                    }}
                                                onClick={() => setShow(true)}
                                    >
                                        {translate("agreement.accept")}
                                        <ErrorOutlineOutlined/>
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <UserAgreement show={show} setShow={setShow}/>
                        </Grid>
                        <Grid item mt={2} mb={2}>
                            <CustomButton
                                type={"submit"}
                                color={"#fcfcfc"}
                                title={formLoading ? translate("buttons.submitting") : translate("pages.register.buttons.submit")}
                                backgroundColor={"cornflowerblue"}
                                fullWidth
                            />
                        </Grid>
                        <Grid container justifyContent="flex-end">
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
                <ModalWindow textButtonCancel={translate("buttons.close")}
                             textButtonConfirm={translate("verify.openGmail")}
                             textTitle={translate("verify.activation")} message={translate("verify.verifyMes")}
                             handleSubmit={() => window.location.replace('https://mail.google.com/')} open={openModal}
                             close={setOpenModal}/>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </Box>
    );
}
export default Register;