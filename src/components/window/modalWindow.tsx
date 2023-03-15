import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import CustomButton from "../common/CustomButton";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts";

interface IProps {
    textButtonConfirm?: string,
    textButtonCancel: string,
    textTitle: string,
    message: string,
    handleSubmit: any,
    open: boolean,
    close: any,
    icon?: any
}

const ModalWindow = ({handleSubmit, textButtonCancel, message, textButtonConfirm, textTitle, open, close, icon}: IProps) => {

    const {mode} = useContext(ColorModeContext);

    return (
        <>
            {
                open && <Box position={"fixed"} top={0} left={0} zIndex={200} width={"100%"} minHeight={'100vh'}
                             bgcolor={"rgba(60, 60, 60, 0.5)"} display={"flex"} justifyContent={"center"}
                             alignItems={"center"}>
                    <Card
                        sx={{
                            width: "330px",
                            height: "400px",
                            padding: "10px",
                            "&:hover": {
                                boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.1)",
                            },
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center"
                        }}
                        elevation={0}

                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "10px",
                                padding: "15px 20px",
                                height: "100%"
                            }}
                        >
                            <Stack direction="column" gap={3} height={"100%"} justifyContent={"space-evenly"}>
                                <Typography fontSize={24} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142d"}>
                                    {textTitle}
                                </Typography>
                                <Typography fontSize={18} whiteSpace={'pre-wrap'} fontWeight={400} color={mode === "dark" ? "#fcfcfc" : "#11142d"}>
                                    {message}
                                </Typography>

                                <Stack display={"flex"} direction={"row"} justifyContent={"space-between"}>
                                    <CustomButton title={textButtonCancel} width={"90px"} backgroundColor={"red"}
                                                  color={"#fcfcfc"} handleClick={()=> close(false)}/>
                                    <CustomButton icon={icon ? icon : ''} title={textButtonConfirm ? textButtonConfirm : ''} width={"90px"} backgroundColor={"blue"}
                                                  color={"#fcfcfc"} handleClick={handleSubmit}/>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            }
        </>
    );
};

export default ModalWindow;
