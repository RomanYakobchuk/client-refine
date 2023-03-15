import {Place} from "@mui/icons-material";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack,
} from "@mui/material";
import {PropertyProps} from "../../interfaces/common";
import {useTranslate} from "@refinedev/core";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts";
import {Link} from "react-router-dom";


const PropertyCard = ({
                          mainPhoto,
                          createdBy,
                          description,
                          otherPhoto,
                          type,
                          city,
                          _id,
                          title,
                          rating,
                          tags,
                          verify,
                          location,
                          contacts,
                          features,
                          workSchedule,
                          averageCheck
                      }: PropertyProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    return (
        <Card
            component={Link}
            to={`/home/show/${_id}`}
            color={"default"}
            sx={{
                textDecoration: 'none',
                width: {xs: '175px', sm: '200px', md: "350px"},
                padding: "10px",
                transition: '0.3s linear',
                "&:hover": {
                    boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.1)",
                },
                bgcolor: mode === "dark" ? "#605454" : "#ffffff",
                cursor: "pointer",
            }}
            elevation={0}
        >
            <CardMedia
                component="img"
                width="100%"
                image={mainPhoto}
                alt="card image"
                sx={{
                    borderRadius: "10px",
                    height: {xs: 150, sm: 250}
            }}
            />
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "10px",
                    paddingX: "5px",
                }}
            >
                <Stack direction="column" gap={1}>
                    <Typography sx={{
                        fontSize: {xs: '12px', sm: '16px'}
                    }} fontWeight={700} color="default">
                        {title}
                    </Typography>
                    <Typography fontSize={{xs: 12, sm: 14}} fontWeight={400} color="default">
                        {
                            type === "бар"
                                ? translate('home.create.type.bar')
                                : type === 'ресторан'
                                    ? translate('home.create.type.restaurant')
                                    : type === "кафе"
                                        ? translate('home.create.type.cafe')
                                        : type
                        }
                    </Typography>
                    <Stack direction="row" gap={0.5} justifyContent={"center"} alignItems="center">
                        <Place
                            sx={{
                                fontSize: {xs: 12, sm: 18},
                                color: "secondary",
                            }}
                        />
                        <Typography sx={{
                            fontSize: {xs: '12px', sm: '16px'}
                        }} color="main">
                            {city}
                        </Typography>
                    </Stack>
                </Stack>
                <Box
                    px={1.5}
                    py={0.5}
                    borderRadius={1}
                    bgcolor="#dadefa"
                    height="fit-content"
                >
                    <Typography sx={{
                        fontSize: {xs: '12px', sm: '16px'}
                    }} fontWeight={600} color="#475be8">
                        {translate('home.create.averageCheck')} ~ ₴{averageCheck}
                    </Typography>
                </Box>
            </CardContent>
            <Box>
                <Typography whiteSpace={"pre-wrap"} sx={{
                    fontSize: {xs: '12px', sm: '16px'}
                }}>
                    {description?.split(' ').length > 20 ? description?.split(' ')?.slice(0, 50)?.join() + ' ...' : description}
                </Typography>
            </Box>
        </Card>
    );
};

export default PropertyCard;