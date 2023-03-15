import {useNavigate} from "react-router-dom";
import {useGetIdentity, useGetLocale, useTranslate} from "@refinedev/core";
import React, {ChangeEvent, FC, SyntheticEvent, useContext, useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {FieldValues} from "react-hook-form";
import { useForm} from "@refinedev/react-hook-form";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import {ImageField} from "@refinedev/antd";
import {DatePicker, LocalizationProvider, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer, DemoItem} from "@mui/x-date-pickers/internals/demo";
import {AddCircleOutline, ArrowBackIosNew, DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {GoogleMap, Marker, InfoWindow, useJsApiLoader} from "@react-google-maps/api"

import {CustomButton, ModalWindow} from "../index";
import {City, ProfileProps, PropertyProps} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";
import ItemsList from "./ItemsList";
import {center, options, containerStyle} from "./mapsOptrions"
import ImageSelector from "./ImageSelector";


const CreateInstitution: FC = () => {

    const navigate = useNavigate();
    const {data: user} = useGetIdentity<ProfileProps>();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
    });


    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = (map: google.maps.Map): void => {
        mapRef.current = map
    }

    const onUnmount = (): void => {
        mapRef.current = null
    }

    const [type, setType] = useState('');
    const [mainPhoto, setMainPhoto] = useState<any>();
    const [otherPhoto, setOtherPhoto] = useState<any>([]);
    const [workSchedule, setWorkSchedule] = useState<PropertyProps["workSchedule"] | any>({})
    const [workScheduleWorkDays, setWorkScheduleWorkDays] = useState<PropertyProps["workSchedule"]["workDays"] | any>({
        days: {
            from: "",
            to: ""
        },
        time: {
            from: "",
            to: ""
        }
    });
    const [workScheduleWeekend, setWorkScheduleWeekend] = useState<PropertyProps["workSchedule"]["weekend"]>("")
    const [location, setLocation] = useState<google.maps.LatLngLiteral | any>({} as google.maps.LatLngLiteral);
    const [tags, setTags] = useState<any>([]);
    const [features, setFeatures] = useState<any>([]);
    const [contacts, setContacts] = useState<any>([]);
    const [open, setOpen] = useState<boolean>(false);


    const handleAddContact = (contact: string) => {
        setContacts([...contacts, contact]);
    };
    const handleDeleteContact = (index: number | any) => {
        setContacts(contacts.filter((_: any, i: any) => i !== index));
    };
    const handleAddTag = (tag: string) => {
        setTags([...tags, tag]);
    };

    const handleDeleteTag = (index: number | any) => {
        setTags(tags.filter((_: any, i: any) => i !== index));
    };
    const handleAddFeature = (feature: string) => {
        setFeatures([...features, feature]);
    };

    const handleDeleteFeature = (index: number | any) => {
        setFeatures(features.filter((_: any, i: any) => i !== index));
    };

    useEffect(() => {
        if (workScheduleWorkDays && workScheduleWeekend) {
            setWorkSchedule({
                workDays: workScheduleWorkDays,
                weekend: workScheduleWeekend,
            })
        }
    }, [workScheduleWorkDays, workScheduleWeekend])

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        setLocation({lat: e.latLng?.lat(), lng: e.latLng?.lng()})
    }
    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value);
    };
    const {
        refineCore: {onFinish, formLoading},
        register,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `institution/create`,
            redirect: false,

        }
    });


    const handleMainPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMainPhoto(e.target.files![0])
    }

    const handleOtherPhotoChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        let arr = [];
        const items = e.target.files;
        for (let i = 0; i < items?.length; i++) {
            const item = items[i];
            item.order = i + 1
            arr.push(item)
        }
        setOtherPhoto([...arr])
    }

    const deleteImage = () => {
        setMainPhoto([])
    }

    const handleOpen = () => {
        if ((!mainPhoto && !mainPhoto.name) || (!otherPhoto && otherPhoto?.length < 0)) return alert("Виберіть головне фото");

        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        setOpen(true)
    }


    const onFinishHandler = async (date: FieldValues) => {

        if ((!mainPhoto && !mainPhoto.name) || (!otherPhoto && otherPhoto?.length < 0)) return alert("Виберіть головне фото");

        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        const formData = new FormData();


        formData.append("mainPhoto", mainPhoto as File);
        for (let i = 0; i < otherPhoto.length; i++) {
            console.log(otherPhoto[i].order)
            formData.append('otherPhoto', otherPhoto[i] as File, otherPhoto[i].order);
        }
        formData.append("description", date?.description);
        formData.append("title", date?.title);
        formData.append("city", date?.city);
        formData.append("type", type);

        formData.append("contacts", JSON.stringify(contacts))

        formData.append("tags", JSON.stringify(tags))

        formData.append("features", JSON.stringify(features))

        formData.append("averageCheck", date?.averageCheck)

        formData.append("workSchedule", JSON.stringify(workSchedule))

        formData.append("location", JSON.stringify(location))


        await onFinish(formData)

        setOpen(false)

        navigate('/home')
    }


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

                <Typography fontSize={{xs: 18, md: 22}} fontWeight={700} textAlign={"start"}>
                    {translate("home.create.title")}
                </Typography>
            </Box>
            <Box mt={2.5} borderRadius="15px" padding="15px" bgcolor={(theme) => theme.palette.background.paper}>
                <Box
                    component={"form"}
                    sx={{
                        marginTop: "20px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: {xs: '10px', sm: '20px'},
                    }}
                    onSubmit={handleSubmit(onFinishHandler)}
                >
                    <FormControl sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: {xs: "column", sm: 'row'},
                        gap: {xs: 2, sm: 4},
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize:{xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("home.create.mainPhoto")}
                        </FormHelperText>
                        <Box sx={{
                            width: {xs: "250px", md: "440px"},
                            height: {xs: "170px", md: "320px"},
                            borderRadius: "5px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {
                                mainPhoto?.name ?
                                    <ImageField alt={"image"}
                                           value={URL.createObjectURL(mainPhoto)}
                                           preview={{zIndex: 10000}}
                                           width={"auto"}
                                           height={"100%"}
                                           style={{
                                               objectFit: "cover",
                                               borderRadius: '10px'
                                           }}/>
                                    : <Button component={"label"} sx={
                                        {
                                            width: {xs: "250px", md: "440px"},
                                            height: {xs: "170px", md: "320px"},
                                            display: 'flex',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: '5px',
                                            cursor: "pointer",
                                            transition: "300ms linear",
                                            "&:hover": {
                                                bgcolor: 'silver',
                                            },
                                            border: `1px solid ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                                        }
                                    }>
                                        <AddCircleOutline sx={{
                                            color: mode === "dark" ? "#fcfcfc" : "#9ba5c9",
                                            fontSize: {xs: "70px", md: "160px"}
                                        }}/>
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                handleMainPhotoChange(e);
                                            }}
                                        />
                                    </Button>
                            }
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            {
                                mainPhoto && mainPhoto?.name
                                    ? <>
                                        <Button
                                            component="label"
                                            sx={{
                                                color: "#fcfcfc",
                                                fontSize: {xs: 12, sm:14},
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
                                                    handleMainPhotoChange(e);
                                                }}
                                            />
                                        </Button>
                                        <CustomButton handleClick={deleteImage} color={"#fcfcfc"}
                                                      title={translate("profile.edit.delete")}
                                                      backgroundColor={"red"}
                                                      icon={<DeleteForeverOutlined style={{color: '#fcfcfc'}}/>}/>
                                    </>
                                    : <div></div>
                            }

                        </Box>
                    </FormControl>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', lg: 'row'},
                        width: '100%',
                        gap: {xs: 2, md: 4}
                    }}>

                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.name")}
                            </FormHelperText>
                            <TextField
                                fullWidth
                                required
                                size={"small"}
                                id="outlined-basic"
                                color="info"
                                variant="outlined"
                                {...register('title', {required: true})}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.description")}
                            </FormHelperText>
                            <TextareaAutosize
                                minRows={5}
                                required
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    fontSize: "16px",
                                    borderRadius: 6,
                                    padding: 10,
                                    color: mode === "dark" ? "#fcfcfc" : "#000",
                                }}
                                id="outlined-basic"
                                color="info"
                                {...register('description', {required: true})}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: {xs: 'column', lg: 'row'},
                        gap: {xs: 2, sm: 4}
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.city")}

                            </FormHelperText>
                            <TextField
                                fullWidth
                                required
                                id="outlined-basic"
                                color="info"
                                size={"small"}
                                variant="outlined"
                                {...register('city', {required: true})}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.type.title")}

                            </FormHelperText>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                sx={{
                                    fontSize: {xs: 12, sm: 16},
                                }}
                                color={"info"}
                                onChange={handleChange}
                            >
                                {
                                    [
                                        {
                                            title: translate("home.sortByType.bar"),
                                            value: 'бар'
                                        },
                                        {
                                            title: translate("home.sortByType.cafe"),
                                            value: "кафе"
                                        },
                                        {
                                            title: translate("home.sortByType.restaurant"),
                                            value: 'ресторан'
                                        }
                                    ].map((type) => (
                                        <MenuItem sx={{
                                            fontSize: {xs: 12, sm: 16},
                                        }} key={type.value}
                                                  value={type.value.toLowerCase()}>{type.title}</MenuItem>
                                    ))
                                }
                            </Select>

                        </FormControl>
                    </Box>
                    <FormControl fullWidth>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("home.create.workSchedule.title")}
                        </FormHelperText>
                        <Box sx={{
                            width: "100%",
                            border: "1px solid silver",
                            borderRadius: "5px",
                            padding: "15px"
                        }}>
                            <FormControl fullWidth sx={{
                                fontWeight: 500,
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 500,
                                        margin: "10px 0",
                                        fontSize: {xs: 12, sm: 16},
                                        color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                    }}
                                >
                                    {translate("home.create.workSchedule.workDays.title")}
                                </FormHelperText>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {xs: "column", sm: "row"},
                                    alignItems: 'center',

                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        width: {xs: "100%", sm: "50%"},
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        pt: "8px"
                                    }}>
                                        <FormControl>
                                            <InputLabel
                                                id="demo-simple-select-label-1">{translate("home.create.workSchedule.workDays.days.from")}</InputLabel>
                                            <Select
                                                id="demo-simple-select-1"
                                                color={"info"}
                                                labelId={"demo-simple-select-label-1"}
                                                sx={{
                                                    width: "130px",
                                                    fontSize: {xs: 12, sm: 16},
                                                }}
                                                value={workScheduleWorkDays?.days?.from ?? ""}
                                                onChange={(event: any) => setWorkScheduleWorkDays({
                                                    days: {
                                                        from: event.target.value,
                                                        to: workScheduleWorkDays?.days?.to
                                                    },
                                                    time: {
                                                        from: workScheduleWorkDays?.time?.from,
                                                        to: workScheduleWorkDays?.time?.to,
                                                    }
                                                })}
                                            >
                                                <MenuItem
                                                    value={"monday"}>{translate("home.create.workSchedule.dayName.monday")}</MenuItem>
                                                <MenuItem
                                                    value={"tuesday"}>{translate("home.create.workSchedule.dayName.tuesday")}</MenuItem>
                                                <MenuItem
                                                    value={"wednesday"}>{translate("home.create.workSchedule.dayName.wednesday")}</MenuItem>
                                                <MenuItem
                                                    value={"thursday"}>{translate("home.create.workSchedule.dayName.thursday")}</MenuItem>
                                                <MenuItem
                                                    value={"friday"}>{translate("home.create.workSchedule.dayName.friday")}</MenuItem>
                                                <MenuItem
                                                    value={"saturday"}>{translate("home.create.workSchedule.dayName.saturday")}</MenuItem>
                                                <MenuItem
                                                    value={"sunday"}>{translate("home.create.workSchedule.dayName.sunday")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                        -
                                        <FormControl>

                                            <InputLabel
                                                id="demo-simple-select-label-2">{translate("home.create.workSchedule.workDays.days.to")}</InputLabel>
                                            <Select
                                                sx={{
                                                    width: "130px",
                                                    fontSize: {xs: 12, sm: 16},
                                                }}
                                                color={"info"}
                                                id="demo-simple-select-2"
                                                labelId={"demo-simple-select-label-2"}
                                                value={workScheduleWorkDays?.days?.to ?? ""}

                                                onChange={(event: any) => setWorkScheduleWorkDays({
                                                    days: {
                                                        from: workScheduleWorkDays?.days?.from,
                                                        to: event.target.value
                                                    },
                                                    time: {
                                                        from: workScheduleWorkDays?.time?.from,
                                                        to: workScheduleWorkDays?.time?.to,
                                                    }
                                                })}
                                            >
                                                <MenuItem
                                                    value={"monday"}>{translate("home.create.workSchedule.dayName.monday")}</MenuItem>
                                                <MenuItem
                                                    value={"tuesday"}>{translate("home.create.workSchedule.dayName.tuesday")}</MenuItem>
                                                <MenuItem
                                                    value={"wednesday"}>{translate("home.create.workSchedule.dayName.wednesday")}</MenuItem>
                                                <MenuItem
                                                    value={"thursday"}>{translate("home.create.workSchedule.dayName.thursday")}</MenuItem>
                                                <MenuItem
                                                    value={"friday"}>{translate("home.create.workSchedule.dayName.friday")}</MenuItem>
                                                <MenuItem
                                                    value={"saturday"}>{translate("home.create.workSchedule.dayName.saturday")}</MenuItem>
                                                <MenuItem
                                                    value={"sunday"}>{translate("home.create.workSchedule.dayName.sunday")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        width: {xs: "100%", sm: "50%"},
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={[
                                                    'MobileTimePicker',
                                                ]}
                                                sx={{
                                                    width: "50%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }}
                                            >
                                                <DemoItem label={translate("")}>
                                                    <MobileTimePicker
                                                        sx={{width: "130px", color: "info"}}
                                                        views={['hours', 'minutes']}
                                                        defaultValue={dayjs('2022-04-17T15:30')}
                                                        value={workScheduleWorkDays?.time?.from ?? ""}
                                                        onChange={(value: any) => setWorkScheduleWorkDays({
                                                            days: {
                                                                from: workScheduleWorkDays?.days?.from,
                                                                to: workScheduleWorkDays?.days?.to
                                                            },
                                                            time: {
                                                                from: value,
                                                                to: workScheduleWorkDays?.time?.to,
                                                            }
                                                        })}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        -
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={[
                                                    'MobileTimePicker',
                                                ]}
                                                sx={{
                                                    width: "50%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }}
                                            >
                                                <DemoItem label={translate("")}>
                                                    <MobileTimePicker
                                                        sx={{width: "130px", color: 'info'}}
                                                        views={['hours', 'minutes']}
                                                        defaultValue={dayjs('2022-04-17T15:30')}
                                                        value={workScheduleWorkDays?.time?.to ?? ""}
                                                        onChange={(value: any) => setWorkScheduleWorkDays({
                                                            days: {
                                                                from: workScheduleWorkDays?.days?.from,
                                                                to: workScheduleWorkDays?.days?.to
                                                            },
                                                            time: {
                                                                from: workScheduleWorkDays?.time?.from,
                                                                to: value,
                                                            }
                                                        })}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </FormControl>
                            <FormControl fullWidth>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 500,
                                        margin: "10px 0",
                                        fontSize: {xs: 12, sm: 16},
                                        color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                    }}
                                >
                                    {translate("home.create.workSchedule.weekend.title")}

                                </FormHelperText>
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-basic"
                                    color="info"
                                    size={"small"}
                                    variant="outlined"
                                    placeholder={`${translate("home.create.workSchedule.weekend.example")}: 01.01, 07.01, ...`}
                                    value={workScheduleWeekend}
                                    onChange={(e: any) => setWorkScheduleWeekend(e.target.value)}
                                />
                            </FormControl>
                        </Box>
                    </FormControl>
                    <FormControl fullWidth>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("home.create.location.title")}
                        </FormHelperText>
                        {
                            isLoaded ?
                                <Box sx={{
                                    width: "100%",
                                    height: {xs: "350px", md: "400px"},
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        options={options as google.maps.MapOptions}
                                        zoom={10}
                                        onLoad={onLoad}
                                        onClick={onMapClick}
                                        onUnmount={onUnmount}>
                                        {
                                            location.lat ? <Marker position={location}/> : null
                                        }
                                    </GoogleMap>
                                </Box> : <Box sx={{
                                    width: "100%",
                                    height: {xs: "350px", md: "400px"},
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <CircularProgress/>
                                </Box>
                        }
                        {
                            (location.lat && location.lng) ?
                                <TextField
                                    fullWidth
                                    required
                                    sx={{
                                        mt: 2
                                    }}
                                    id="outlined-basic"
                                    color="info"
                                    disabled
                                    label={translate("home.create.location.coordinates.title")}
                                    variant="outlined"
                                    value={`lat: ${location?.lat}   lng: ${location?.lng}`}
                                    onChange={() => {
                                    }}
                                /> : ''
                        }
                    </FormControl>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', lg: 'row'},
                        width: '100%',
                        gap: {xs: 2, sm: 4}
                    }}>

                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.contacts")}
                            </FormHelperText>
                            <ItemsList elements={contacts} label={translate('home.create.contacts')}
                                       onSubmit={handleAddContact} onDelete={handleDeleteContact}/>
                        </FormControl>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.tags")}
                            </FormHelperText>
                            <ItemsList elements={tags} label={translate('home.create.tags')} onSubmit={handleAddTag}
                                       onDelete={handleDeleteTag}/>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', lg: 'row'},
                        width: '100%',
                        gap: {xs: 2, sm: 4}
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.features")}
                            </FormHelperText>
                            <ItemsList elements={features} label={translate('home.create.features')}
                                       onSubmit={handleAddFeature} onDelete={handleDeleteFeature}/>
                        </FormControl>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.averageCheck")}
                            </FormHelperText>
                            <TextField
                                fullWidth
                                required
                                id="outlined-basic"
                                color="info"
                                variant="outlined"
                                {...register('averageCheck', {required: true})}
                            />
                        </FormControl>
                    </Box>
                    <FormControl>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "10px 0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("home.create.otherPhoto.title")}
                        </FormHelperText>
                        <ImageSelector images={otherPhoto} setOtherPhoto={setOtherPhoto}
                                       handleChange={handleOtherPhotoChange}/>

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
                            handleClick={() => navigate("/home")}
                        />
                        <CustomButton
                            width={"60%"}
                            title={formLoading ? <CircularProgress/> : translate("profile.edit.save")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                            handleClick={handleOpen}
                        />
                        <ModalWindow
                            close={setOpen}
                            open={open}
                            handleSubmit={handleSubmit(onFinishHandler)}
                            message={translate("home.create.message")}
                            textButtonCancel={translate("buttons.cancel")}
                            textButtonConfirm={formLoading ? '' : translate("buttons.create")}
                            icon={formLoading ? <CircularProgress/> : ""}
                            textTitle={translate("home.create.confirmTitle")}
                        />
                    </FormControl>
                </Box>
            </Box>
        </Box>
    )
        ;
};
export default CreateInstitution;
