import React, {ChangeEvent, useContext, useEffect} from "react";
import {AddCircleOutline, Delete} from "@mui/icons-material";
import {Box, Button, TextField} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../contexts";


interface CarouselProps {
    images: string[] | any;
    onChange: any,
    items?: [] | any
}

const Carousel = ({images, onChange, items}: CarouselProps) => {

        const translate = useTranslate();
        const {mode} = useContext(ColorModeContext);

        const deleteImage = (index: number) => {
            onChange(items.filter((_: any, i: any) => i !== index))
        }
        useEffect(() => {
            onChange(items)
        }, [items])

        const updateOrder = (e: ChangeEvent<HTMLInputElement>, index: number, image: File) => {
            const order = e.target.value;
            const file = image;
            if (file && e.target.value) {
                onChange((items: File[]) => {
                    const customFile = Object.assign(file, {order: order});
                    const newItems = [...items];
                    newItems[index] = customFile;
                    return newItems;
                });
            }
        };

        const addImage = (e: ChangeEvent<HTMLInputElement> | any) => {
            const newItems = [];
            const elements = e.target.files;

            if(items.length + elements.length > 10) return alert(translate("home.create.otherPhoto.max"))
            if (elements) {
                for (let i = 0; i < elements?.length; i++) {
                    const item = elements[i];
                    item.order = items.length + 1 + i;
                    newItems.push(item)
                }
            }

            onChange([...items, ...newItems])
        }

        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                overflow: "hidden",
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: 'row',
                        overflowX: 'scroll',
                        width: {xs: '340px', sm: '600px', md: '600px', lg: '800px', xl: '1200px'},
                        gap: '5px',
                        scrollBehavior: "smooth",
                        scrollSnapType: "x mandatory",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "blue",
                            borderRadius: "8px",
                        },
                        "&:hover::-webkit-scrollbar-thumb": {
                            background: "blue",
                        },
                    }}
                >
                    {items.map((image: any, index: number) => (

                            <Box key={index} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid silver',
                                mb: 2,
                                borderRadius: '5px',
                                p: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2
                            }}>
                                <Box component={'img'} sx={{
                                    width: 'auto',
                                    height: {xs: '200px', md: '300px'}
                                }}
                                    src={image instanceof Blob ? URL.createObjectURL(image) : image}
                                    alt={`Image ${index}`}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <TextField
                                        value={items?.order}
                                        type={"number"}
                                        size={"small"}
                                        color={"info"}
                                        onChange={(e: any) => updateOrder(e, index, image)}
                                        label={translate("home.create.otherPhoto.label")}
                                        placeholder={translate("home.create.otherPhoto.inputPlace")}/>
                                    <Delete onClick={() => deleteImage(index)}/>
                                </Box>
                            </Box>
                        )
                    )}
                    <Button component={"label"} sx={
                        {
                            width: "100px",
                            height: {xs: '300px', md: "400px"},
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: '5px',
                            cursor: "pointer",
                            mb: 2,
                            transition: "300ms linear",
                            "&:hover": {
                                bgcolor: 'silver',
                            },
                            border: `1px solid ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                        }
                    }>
                        <AddCircleOutline sx={{
                            color: mode === "dark" ? "#fcfcfc" : "#9ba5c9",
                            fontSize: {xs: "40px", md: "70px"}
                        }}/>
                        <input
                            hidden
                            accept="image/*"
                            type="file"
                            multiple
                            onChange={addImage}
                        />
                    </Button>
                </Box>
            </Box>
        );
    }
;

export default Carousel;