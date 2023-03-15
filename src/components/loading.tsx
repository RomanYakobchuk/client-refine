import {Box, CircularProgress} from "@mui/material";

const Loading = () => {
    return (
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
                position: 'relative',
                margin: '10px',
                height: 'auto',
                padding: '25px 20px'
            }}>
                <CircularProgress color="secondary" sx={{
                    fontSize: '60px'
                }}/>
            </Box>
        </Box>
    );
};

export default Loading