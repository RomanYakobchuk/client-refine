import {useGetIdentity, useOne, useTranslate} from "@refinedev/core";
import {
    Box, Button,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
    Slider, Avatar, CircularProgress
} from "@mui/material";
import Datepicker from "react-datepicker";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {FieldValues} from "react-hook-form";
import {ArrowBackIosNew, DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {CustomButton} from "../index";
import {useNavigate, useParams} from "react-router-dom";
import {ColorModeContext} from "../../contexts";
import {ProfileProps} from "../../interfaces/common";
import {ImageField} from "@refinedev/antd";

const EditProfile = () => {
    const {id: _id} = useParams();
    const navigate = useNavigate();
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {mode} = useContext(ColorModeContext);

    const [propertyImage, setPropertyImage] = useState<any>();
    const [userDOB, setUserDOB] = useState<string>("");
    const [userNewDOB, setUserNewDOB] = useState<Date | any>();
    const translate = useTranslate();
    console.log(propertyImage)

    useEffect(() => {
        if (!currentUser?.isAdmin && _id !== currentUser?._id) {
            navigate('/profile')
        }
    }, [currentUser?._id, currentUser?.isAdmin, _id])

    const {data, isLoading, isError}: any = useOne({
        resource: 'users',
        id: _id as string
    });
    const user = data?.data ?? [];

    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `users/${_id}`,
        },
    },);

    useEffect(() => {
        if (user?.dOB) {
            const date = new Date(user?.dOB)?.toISOString()?.split('T')[0];
            // const date = user?.dOB.substring(0, 10)
            setUserDOB(date)
        }
    }, [user?.dOB])

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPropertyImage(e.target.files![0])
    }

    const deleteImage = () => {
        setPropertyImage([])
    }

    const onFinishHandler = async (date: FieldValues) => {

        if ((new Date(userNewDOB)?.getFullYear() || new Date(user?.dOB)?.getFullYear()) > (new Date().getFullYear() - 18)) {
            return alert(translate("profile.edit.alert"))
        } else {
        }
        const formData = new FormData();
        formData.append("avatar", propertyImage as File ?? user?.avatar);
        formData.append("changeAva", propertyImage && true);
        formData.append("name", date?.name);
        formData.append("phone", date?.phone);
        formData.append("dOB", userNewDOB ?? user?.dOB);
        formData.append("currentId", currentUser?._id)

        const {data}: any = await onFinish(formData)
        if (_id === currentUser?._id) {
            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data?.user)
                );
            } else if (data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );
            }
        }
        navigate(`/profile`)
    }


    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>


    return (

        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "start",
                gap: {xs: '10%', sm: '30%', md: '40%'}
            }}>
                <CustomButton handleClick={() => navigate(-1)} width={'50px'} title={""} backgroundColor={'blue'}
                              color={'#fcfcfc'} icon={<ArrowBackIosNew/>}/>

                <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700} textAlign={"center"}>
                    {translate("profile.edit.title")}
                </Typography>
            </Box>

            <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}>
                <form
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                    onSubmit={handleSubmit(onFinishHandler)}
                >
                    <FormControl sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: {xs: 2, md: 5},
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {
                            propertyImage?.name
                                ? <Box sx={{
                                    width: {xs: "160px", md: "340px"},
                                    height: {xs: "150px", md: "320px"},
                                }}>
                                    <ImageField alt={"image"}
                                                width={"100%"}
                                                height={"100%"}
                                                preview={{zIndex: 10000}}
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: '5px'
                                                }} value={URL.createObjectURL(propertyImage)}/>
                                </Box>
                                : <Box sx={{
                                    width: {xs: "160px", md: "340px"},
                                    height: {xs: "150px", md: "320px"},
                                }}>
                                    {
                                        user?.avatar ?
                                            <ImageField alt={"image"}
                                                        value={currentUser?.avatar}
                                                        width={"100%"}
                                                        preview={{zIndex: 10000}}
                                                        height={"100%"}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: '5px'
                                                        }}/> :
                                            <Avatar sx={{
                                                width: {xs: "200px", md: "340px"},
                                                height: {xs: "190px", md: "320px"},
                                                borderRadius: '5px'
                                            }}/>
                                    }
                                </Box>
                        }

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: 2
                        }}>

                            <Button
                                component="label"
                                sx={{
                                    color: "#fcfcfc",
                                    fontSize: {xs: 12, sm: 14},
                                    bgcolor: 'blue',
                                    width: '130px',
                                    textTransform: 'capitalize',
                                    gap: 1,
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    "&:hover": {
                                        bgcolor: '#0d2986',
                                    }
                                }}
                            >
                                <Edit sx={{fontSize: {xs: 16, sm: 18}}}/>
                                {translate("profile.edit.change")}
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        handleImageChange(e);
                                    }}
                                />
                            </Button>
                            {
                                propertyImage && propertyImage?.name
                                    ? <CustomButton handleClick={deleteImage} color={"#fcfcfc"}
                                                    title={translate("profile.edit.delete")}
                                                    backgroundColor={"red"}
                                                    icon={<DeleteForeverOutlined style={{color: '#fcfcfc'}}/>}/>
                                    : <div></div>
                            }

                        </Box>
                    </FormControl>
                    <FormControl>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("profile.edit.name")}
                        </FormHelperText>
                        <TextField
                            fullWidth
                            required
                            size={"small"}
                            id="outlined-basic"
                            color="info"
                            defaultValue={user?.name}
                            variant="outlined"
                            {...register('name', {required: true})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormHelperText sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                        >
                            {translate("profile.edit.dOB")}
                        </FormHelperText>
                        <TextField fullWidth
                                   required
                                   id="outlined-basic"
                                   color="info"
                                   size={"small"}
                                   type={"date"}
                                   value={userNewDOB ? userNewDOB : userDOB}
                            // defaultValue={userDOB ?? userNewDOB}
                                   variant="outlined"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setUserNewDOB(e.target.value)}
                            //{...register('dOB', {required: true})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("profile.edit.phone")}
                        </FormHelperText>
                        <TextField
                            fullWidth
                            required
                            id="outlined-basic"
                            color="info"
                            defaultValue={user?.phone}
                            type={"text"}
                            size={"small"}
                            variant="outlined"
                            {...register('phone', {required: true})}
                        />
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: 'center'
                    }}>
                        <CustomButton
                            width={"38%"}
                            title={translate("profile.edit.cancel")}
                            backgroundColor="red"
                            color="#fcfcfc"
                            handleClick={() => navigate("/profile")}
                        />
                        <CustomButton
                            type="submit"
                            width={"60%"}
                            title={formLoading ? <CircularProgress/> : translate("profile.edit.save")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                        />
                    </FormControl>
                </form>
            </Box>
        </Box>
    );
};


export default EditProfile;