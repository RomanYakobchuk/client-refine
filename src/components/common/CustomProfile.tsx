import {ChatBubble, Edit, Email, Phone, Place} from "@mui/icons-material";
import {Avatar, Box, Stack, Typography} from "@mui/material";
import {ProfileProps, PropertyProps} from "interfaces/common";
import PropertyCard from "./PropertyCard";
import {CustomButton} from "../index";
import React, {useContext} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Image} from "antd";
import {ColorModeContext} from "../../contexts";

// function checkImage(url: any) {
//     const img = new Image();
//     img.src = url;
//     return img.width !== 0 && img.height !== 0;
// }

const CustomProfile = ({
                           name,
                           avatar,
                           email,
                           phone,
                           _id,
                           dOB,
                           phoneVerify,
                           isAdmin,
                           allInstitutions,
                           isActivated,
                           favoritePlaces,
                           myReviews
                       }: ProfileProps) => {
    const {data: user} = useGetIdentity<ProfileProps>();

    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const isCurrentUser = user?.email === email;

    return (
        <Box>
            <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700}
                        color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                {translate("profile.profile")}
            </Typography>
            <Box mt={{xs: '10px', sm: '20px'}} borderRadius="15px" padding="10px"
                 bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2.5,
                    }}
                >
                    <Box display={"flex"} gap={2} flexDirection={"column"} sx={{
                        alignItems: {xs: "center", sm: "start"}
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: {xs: "140px", md: "340px"},
                            height: {xs: "130px", md: "320px"},
                            gap: 3
                        }}>
                            {
                                avatar ?
                                    <Image alt={"image"}
                                           preview={{zIndex: 10000}}
                                           src={avatar}
                                           width={"100%"}
                                           height={"100%"}
                                           style={{
                                               objectFit: "cover",
                                               borderRadius: '5px'
                                           }}/> :
                                    <Avatar sx={{
                                        width: {xs: "140px", md: "340px"},
                                        height: {xs: "130px", md: "320px"},
                                        borderRadius: '5px'
                                    }}/>
                            }
                            <Box sx={{
                                display: {xs: 'block', md: 'none'}
                            }}>
                                <CustomButton
                                    title={translate("profile.edit.title")}
                                    backgroundColor="#475BE8"
                                    color="#FCFCFC"
                                    icon={<Edit/>}
                                    handleClick={() => {
                                        navigate(
                                            `/profile/edit/${user?._id}`
                                        )
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        flex={1}
                    >
                        <Box
                            flex={1}
                            display="flex"
                            flexDirection={{xs: "column", md: "row"}}
                            gap="20px"
                        >
                            <Box
                                flex={1}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                gap="20px"
                            >
                                <Stack direction="row" justifyContent={"space-between"}>
                                    <Box display={"flex"} flexDirection={"column"}>
                                        <Typography
                                            fontSize={{xs: 14, md: 20}}
                                            fontWeight={600}
                                            color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                        >
                                            {name}
                                        </Typography>
                                    </Box>

                                </Stack>
                                <Stack direction="column" gap="20px">
                                    <Stack
                                        direction="row"
                                        flexWrap="wrap"
                                        gap="20px"
                                        pb={4}
                                    >
                                        <Stack flex={1} gap="15px">
                                            <Typography
                                                fontSize={{xs: 10, sm: 14}}
                                                fontWeight={500}
                                                color={mode === "dark" ? "#eaebed" : "#808191"}
                                            >
                                                {translate("profile.edit.phone")}
                                            </Typography>
                                            <Box
                                                display="flex"
                                                flexDirection="row"
                                                alignItems="center"
                                                gap="10px"
                                            >
                                                <Phone sx={{color: "#11142D"}}/>
                                                <Typography
                                                    fontSize={{xs: 10, sm: 14}}
                                                    color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                                    noWrap
                                                >
                                                    {phone ? phone.toString() : ""}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack flex={1} gap="15px">
                                            <Typography
                                                fontSize={{xs: 10, sm: 14}}
                                                fontWeight={500}
                                                color={mode === "dark" ? "#eaebed" : "#808191"}
                                            >
                                                {translate("profile.email")}
                                            </Typography>
                                            <Box
                                                display="flex"
                                                flexDirection="row"
                                                alignItems="center"
                                                gap="10px"
                                            >
                                                <Email sx={{color: "#11142D"}}/>
                                                <Typography
                                                    fontSize={{xs: 10, sm: 14}}
                                                    color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                                >
                                                    {email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack flex={1} gap="15px">
                                            <Typography
                                                fontSize={{xs: 10, sm: 14}}
                                                fontWeight={500}
                                                color={mode === "dark" ? "#eaebed" : "#808191"}
                                            >
                                                {translate("profile.edit.dOB")}
                                            </Typography>
                                            <Box
                                                display="flex"
                                                flexDirection="row"
                                                alignItems="center"
                                                gap="10px"
                                            >
                                                <Typography
                                                    fontSize={{xs: 10, sm: 14}}
                                                    color={mode === "dark" ? "#fcfcfc" : "#11142D"}
                                                >
                                                    {new Date(dOB)?.toISOString()?.split('T')[0]}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: {xs: 'none', md: 'block'}
                        }}>
                            <CustomButton
                                title={translate("profile.edit.title")}
                                backgroundColor="#475BE8"
                                color="#FCFCFC"
                                icon={
                                    <Edit/>
                                }
                                handleClick={() => {
                                    navigate(
                                        `/profile/edit/${user?._id}`
                                    )
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            {allInstitutions?.length > 0 && (
                <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
                    <Typography fontSize={18} fontWeight={600} color="#11142D">
                        {translate("my-institution.my-institution")}
                    </Typography>
                    <Box
                        mt={2.5}
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2.5,
                            bgcolor: '#d8dee3'
                        }}
                    >
                        {allInstitutions?.map((property: PropertyProps) => (
                            <PropertyCard
                                key={property._id}
                                _id={property._id}
                                title={property.title}
                                city={property.city}
                                description={property.description}
                                mainPhoto={property.mainPhoto}
                                otherPhoto={property.otherPhoto}
                                type={property.type}
                                createdBy={property.createdBy}
                                averageCheck={property.averageCheck}
                                contacts={property.contacts}
                                features={property.features}
                                location={property.location}
                                rating={property?.rating}
                                tags={property.tags}
                                verify={property.verify}
                                workSchedule={property.workSchedule}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
export default CustomProfile;
