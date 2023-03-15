import {Box, Grid, Typography} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {CloseOutlined} from "@mui/icons-material";

interface IProps {
    show: boolean,
    setShow: any,

}

const UserAgreement = ({show, setShow}: IProps) => {
    const translate = useTranslate();
    return (
        <>
            {
                show ?
                    <Box sx={{
                        position: 'absolute',
                        zIndex: 30,
                        flex: 1,
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(90, 90, 90, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Box component={"main"} maxWidth={"500px"} sx={{
                            bgcolor: (theme) => theme.palette.background.default,
                            position: 'relative',
                            margin: '10px',
                            height: 'auto',
                            borderRadius: '10px',
                            padding: '25px 20px'
                        }}>

                            <CloseOutlined onClick={() => setShow(false)} sx={{
                                position: 'absolute',
                                top: "10px",
                                right: "10px",
                                color: 'red',
                                cursor: 'pointer'
                            }}/>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '32px',
                                        fontWeight: 600
                                    }}>
                                        {translate("agreement.title")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                    }}>
                                        {translate("agreement.text1")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                    }}>
                                        {translate("agreement.text2")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                    }}>
                                        {translate("agreement.text3")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box> :
                    <></>
            }
        </>
    );
};

export default UserAgreement;
