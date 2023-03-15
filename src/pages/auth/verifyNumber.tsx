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
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";

import {useNotification, useTranslate} from "@refinedev/core";

import {Header} from "../../components/layout";
import {useForm} from "@refinedev/react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {ColorModeContext} from "../../contexts";
import {axiosInstance} from "@refinedev/simple-rest";
import {parseJwt} from "../../utils/parse-jwt";
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


const VerifyNumber = () => {

    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();
    const [send, setSend] = useState(false);
    const [error, setError] = useState<any>([]);
    const [otp, setOtp] = useState<any>("54321");
    const {token}: any = useParams();

    const valueLength = 5;

    const RE_DIGIT = new RegExp(/^\d+$/);

    const {
        refineCore: {onFinish, formLoading},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: 'auth/verifyNumber',
            onMutationError: (data, variables, context) => {
                setError(data?.response?.data)
            },
        }
    },);
    console.log(otp)
    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [token])

    const dateNow = new Date();
    const onChange = (value: string) => {
        setOtp(value)
    }
    const data_token = token && parseJwt(token);
    if(!data_token) navigate('/')
    useEffect(() => {
        if (data_token.exp * 1000 < dateNow.getTime()) {
            open?.({
                type: "error",
                message: translate("pages.updatePassword.errors.timeIsUp"),
                description: "Wrong",
                key: "unique-id",
            });
            setSend(false)
        }
    }, [data_token, dateNow])


    const onFinishHandler = async (data: FieldValues) => {

        await onFinish({
            userId: data_token?._id,
            verifyCode: otp
        });

        navigate('/login')
    };


    const sendCodeAgain = async () => {
        await axiosInstance.post("/auth/sendVerifyCodeAgain", {
            userId: data_token?._id
        })
        setSend(false);
        setTimeout(() => {
            setSend(true)
        }, 1000 * 60 * 3)
    }
    const valueItems = useMemo(() => {
        const valueArray = otp.split('');
        const items: Array<string> = [];

        for (let i = 0; i < valueLength; i++) {
            const char = valueArray[i];
            if (RE_DIGIT.test(char)) {
                items.push(char);
            } else {
                items.push('');
            }
        }
        return items;
    }, [otp, valueLength]);


    const focusToNextInput = (target: HTMLElement) => {
        const nextElementSibling =
            target.nextElementSibling as HTMLInputElement | null;
        if (nextElementSibling) {
            nextElementSibling.focus();
        }
    };

    const focusToPrevInput = (target: HTMLElement) => {
        const previousElementSibling =
            target.previousElementSibling as HTMLInputElement | null;

        if (previousElementSibling) {
            previousElementSibling.focus();
        }
    };
    const inputOnChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number
    ) => {
        const target = e.target;
        let targetValue = target.value.trim();
        const isTargetValueDigit = RE_DIGIT.test(targetValue);

        if (!isTargetValueDigit && targetValue !== '') {
            return;
        }
        const nextInputEl = target.nextElementSibling as HTMLInputElement | null;
        // only delete digit if next input element has no value

        if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== '') {
            return;
        }
        targetValue = isTargetValueDigit ? targetValue : ' ';
        const targetValueLength = targetValue.length;
        if (targetValueLength === 1) {
            const newValue =
                otp.substring(0, idx) + targetValue + otp.substring(idx + 1);

            onChange(newValue);
            if (!isTargetValueDigit) {
                return;
            }
            focusToNextInput(target);
        } else if (targetValueLength === valueLength) {
            onChange(targetValue);
            target.blur();
        }
    };

    const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const {key} = e;
        const target = e.target as HTMLInputElement;
        if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            return focusToNextInput(target);
        }

        if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            return focusToPrevInput(target);
        }
        const targetValue = target.value;
        // keep the selection range position
        // if the same digit was typed
        target.setSelectionRange(0, targetValue.length);

        if (e.key !== 'Backspace' || targetValue !== '') {
            return;
        }
        focusToPrevInput(target);

    };

    const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {

        const {target} = e;
        // keep focusing back until previous input
        // element has value
        const prevInputEl =
            target.previousElementSibling as HTMLInputElement | null;

        if (prevInputEl && prevInputEl.value === '') {
            return prevInputEl.focus();
        }
        target.setSelectionRange(0, target.value.length);
    };


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
                    component={"form"}
                    onSubmit={handleSubmit(onFinishHandler)}
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar src={`/images/logo.png`} onClick={() => navigate('/')} sx={{m: 1, cursor: 'pointer'}}/>
                    <Typography component="h1" variant="h5">
                        {translate("verify.title")}
                    </Typography>
                    <Box
                         sx={{
                             mt: 1,
                             display: 'flex',
                             width: '100%',
                             maxWidth: '360px',
                             columnGap: '10px'
                         }}>
                        {
                            valueItems.map((digit, idx) => (
                                <input
                                    key={idx}
                                    required
                                    // minRows={5}
                                    style={{
                                        textDecoration: 'none',
                                        width: '100%',
                                        height: '60px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: 0,
                                        textAlign: 'center',
                                        fontSize: '32px',
                                        fontWeight: "bold",
                                        color: mode === "dark" ? '#fcfcfc' : "#000",
                                        background: 'transparent',
                                        lineHeight: 1
                                    }}
                                    type={"number"}

                                    pattern={'\d{1}'}
                                    value={digit}
                                    onKeyDown={inputOnKeyDown}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => inputOnChange(e, idx)}
                                    onFocus={inputOnFocus}
                                />

                            ))
                        }
                    </Box>
                    <Button
                            fullWidth
                            disabled={!send}
                            variant="outlined"
                            sx={{mt: 3, mb: 2, bgcolor: 'green'}} onClick={sendCodeAgain}>
                        {translate("verify.again")}
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={otp.length < 5}
                        sx={{mt: 3, mb: 2, bgcolor: 'cornflowerblue'}}
                    >
                        {
                            formLoading ?
                                translate("verify.submitting") :
                                translate("verify.submit")
                        }
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href={`/login`} variant="body2">
                                {translate("pages.register.buttons.haveAccount")} {translate("pages.login.signin")}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </Box>
    );
}
export default VerifyNumber;
