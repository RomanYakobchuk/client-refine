import React, {useContext,} from 'react';
import {Box, Button, FormControl, Typography} from "@mui/material";
import {AddCircleOutline, DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../contexts";
import Carousel from "./Carousel";

interface Props {
    images: string[] | any;
    setOtherPhoto: any;
    handleChange: any;
}


const ImageSelector = ({images: items, handleChange, setOtherPhoto}: Props) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    return (
        <Box>
            <FormControl sx={{
                display: 'flex',
                flexDirection: "column",
                gap: {xs: 1, md: 3},
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: {xs: 1, md: 2}
                }}>
                    {
                        items && items?.length > 0
                            ? <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: {xs: 'column', md: 'row'},
                                alignItems: 'center',
                                gap: 2,
                                justifyContent: 'start'
                            }}>
                                <Typography sx={{
                                    fontWeight: 400,
                                    margin: "10px 0",
                                    fontSize: 14,
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                                >
                                    {translate("home.create.otherPhoto.message")}

                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2
                                }}>
                                    <Button
                                        component="label"
                                        sx={{
                                            color: "#fcfcfc",
                                            fontSize: {xs: 12, sm: 16},
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
                                        <Edit/>
                                        {translate("profile.edit.change")}
                                        <input
                                            hidden
                                            multiple
                                            accept="image/*"
                                            type="file"
                                            onChange={handleChange}
                                        />
                                    </Button>
                                    <Button onClick={() => setOtherPhoto([])} sx={{
                                        color: "#fcfcfc",
                                        fontSize: {xs: 12, sm: 16},
                                        bgcolor: 'red',
                                        width: '170px',
                                        textTransform: 'capitalize',
                                        gap: 1,
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        "&:hover": {
                                            bgcolor: '#0d2986',
                                        }
                                    }}
                                    >
                                        <DeleteForeverOutlined style={{color: '#fcfcfc'}}/>
                                        {translate("home.create.otherPhoto.deleteAll")}
                                    </Button>
                                </Box>
                            </Box>
                            : <div></div>
                    }

                </Box>
                <Box sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderRadius: "5px",

                }}>
                    {
                        items.length > 0 &&
                        <Typography>
                            {translate("home.create.otherPhoto.count")}: {items.length}
                        </Typography>
                    }
                    {
                        items?.length > 0 ? <Carousel images={items} items={items} onChange={setOtherPhoto}/>

                            : <Button component={"label"} sx={
                                {
                                    minWidth: {xs: "300px", md: "440px"},
                                    minHeight: {xs: "200px", md: "320px"},
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
                                    multiple
                                    onChange={handleChange}
                                />
                            </Button>
                    }
                </Box>
            </FormControl>
        </Box>
    )
}
export default ImageSelector;


