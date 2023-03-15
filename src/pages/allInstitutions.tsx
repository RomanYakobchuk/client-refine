import {useNavigate} from "react-router-dom";
import {Box, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {useTable, useTranslate} from "@refinedev/core";
import React, {useContext, useMemo, useState} from "react";
import {CustomButton, PropertyCard} from "../components";
import {Add, ArrowBackIosNew, ArrowForwardIos} from "@mui/icons-material";
import {PropertyProps} from "../interfaces/common";
import {ColorModeContext} from "../contexts";

const AllInstitutions = () => {
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState("");
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const {
        tableQueryResult: {data, isLoading, isError},
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorter,
        setSorter,
        filters,
        setFilters,
    } = useTable({
        resource: "institution/all",
        metaData: {
            headers: {}
        }
    });

    const allInstitutions = data?.data ?? [];

    const currentSorterOrders = useMemo(() => {
        return {
            rating:
                sorter.find((item) => item.field === "rating")?.order || "desc",
            averageCheck: sorter.find((item) => item.field === "averageCheck")?.order || "desc",
            createdAt:
                sorter.find((item) => item.field === "createdAt")?.order || "asc",
            title:
                sorter.find((item) => item.field === "title")?.order || "desc",

        };
    }, [sorter]);


    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        setSorter([
            {
                field,
                order: currentSorterOrders[field] === "asc" ? "desc" : "asc",
            },
        ]);
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : [],
        );

        return {
            title:
                logicalFilters.find((item) => item.field === "title")?.value || "",
            propertyType:
                logicalFilters.find((item) => item.field === "propertyType")?.value || "",
            averageCheck:
                logicalFilters.find((item) => item.field === "averageCheck")?.value || '',

        };
    }, [filters]);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mt: {xs: "10px", sm: '20px'}
            }}>
                <Stack direction={"column"} width={"100%"}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '16px', sm: '24px'}
                        }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                            {
                                !allInstitutions.length ? translate("home.notHave") : translate("home.title")
                            }
                        </Typography>
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <CustomButton title={translate("home.create.title")} backgroundColor={"#475be8"}
                                          color={"#fcfcfc"} icon={<Add/>}
                                          handleClick={() => navigate('/home/create')}/>
                        </Stack>
                    </Box>

                    <Box mb={{xs: 1, sm: 2}} mt={3} display={"flex"} width={"100%"} justifyContent={"space-between"}
                         flexWrap={"wrap"}>
                        <Box display={"flex"} width={"100%"} gap={2} flexWrap={"wrap"} mb={{xs: '20px', sm: 0}}>
                            <TextField fullWidth variant={"outlined"} color={"info"}
                                       sx={{
                                           fontSize: {xs: '10px', sm: '16px'},
                                       }}
                                       size="small"
                                       placeholder={translate("home.search")}
                                       value={currentFilterValues.title}
                                       onChange={(e) => setFilters([{
                                           field: 'title',
                                           operator: 'contains',
                                           value: e.currentTarget.value ? e.currentTarget.value : undefined
                                       }])}/>

                            <Select variant={"outlined"}  size="small" color={"info"} displayEmpty required
                                    inputProps={{'aria-label': 'Without label'}}
                                    sx={{
                                        fontSize: {xs: '12px', sm: '16px'}
                                    }}
                                    value={currentFilterValues.propertyType}
                                    onChange={(e) => setFilters([{
                                        field: 'propertyType',
                                        operator: 'eq',
                                        value: e.target.value ? e.target.value : undefined
                                    }], 'replace')}>
                                <MenuItem value={""}>{translate("home.sortByType.all")}</MenuItem>
                                {
                                    [{
                                        title: translate("home.sortByType.bar"),
                                        value: "бар"
                                    }, {
                                        title: translate("home.sortByType.cafe"),
                                        value: 'кафе'
                                    }, {
                                        title: translate("home.sortByType.restaurant"),
                                        value: 'ресторан'
                                    }].map((type) => (
                                        <MenuItem key={type.value}
                                                  value={type.value.toLowerCase()}>{type.title}</MenuItem>
                                    ))
                                }
                            </Select>
                            <Select variant={"outlined"}  size="small" color={"info"} displayEmpty required
                                    inputProps={{'aria-label': 'Without label'}}
                                    value={sortBy}
                                    sx={{
                                        fontSize: {xs: '12px', sm: '16px'}
                                    }}
                                    onChange={
                                        (e: any) => {
                                            setSortBy(e.target.value)
                                            toggleSort(e.target.value)
                                        }
                                    }
                            >
                                <MenuItem value={""}>{translate("home.default")}</MenuItem>
                                {
                                    [{
                                        title: translate("home.sortRating") + '  ' + `${currentSorterOrders.rating === 'asc' ? '↑' : '↓'}`,
                                        value: "rating"
                                    }, {
                                        title: currentSorterOrders.createdAt === 'desc' ? 'Найновіші' : 'Найстаріші',
                                        value: 'createdAt'
                                    }, {
                                        title: currentSorterOrders.title === 'desc'
                                            ? translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a")
                                            : translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
                                        value: 'title'
                                    },].map((type) => (
                                        <MenuItem key={type.value} onClick={() => {
                                            if (type.value === 'rating') {
                                                toggleSort('rating')
                                            } else if (type.value === 'createdAt') {
                                                toggleSort('createdAt')
                                            } else if (type.value === 'title') {
                                                toggleSort('title')
                                            }
                                        }}
                                                  value={type.value}>{type.title}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Box mt={{xs: '10px', sm: '20px'}} sx={{display: "flex", flexWrap: "wrap", justifyContent: 'start', gap: {xs: 1, sm: 3}}}>
                {
                    allInstitutions.map((institution: PropertyProps | any) => (
                        <PropertyCard
                            key={institution._id}
                            _id={institution._id}
                            title={institution.title}
                            city={institution.city}
                            description={institution.description}
                            mainPhoto={institution.mainPhoto}
                            otherPhoto={institution.otherPhoto}
                            type={institution.type}
                            createdBy={institution.createdBy}
                            averageCheck={institution.averageCheck}
                            contacts={institution.contacts}
                            features={institution.features}
                            location={institution.location}
                            rating={institution?.rating}
                            tags={institution.tags}
                            verify={institution.verify}
                            workSchedule={institution.workSchedule}
                        />
                    ))
                }
            </Box>
            {
                allInstitutions.length > 0 && (
                    <Box display={"flex"} gap={2} mt={3} flexWrap={"wrap"}>
                        <CustomButton width={{xs: '40px', sm: '60px'}} title={""} icon={<ArrowBackIosNew/>} backgroundColor={"#475be8"}
                                      color={"#fcfcfc"} handleClick={() => setCurrent((prev) => prev - 1)}
                                      disabled={!(current > 1)}/>
                        <Box display={{xs: 'hidden', sm: 'flex'}} fontSize={{xs: '10px', sm: '16px'}} alignItems={"center"} gap={"5px"}>
                            {translate("home.pages.page")}{` `}<strong>{current} {translate("home.pages.of")} {pageCount}</strong>
                        </Box>
                        <CustomButton width={{xs: '40px', sm: '60px'}} title={""} icon={<ArrowForwardIos/>} backgroundColor={"#475be8"}
                                      color={"#fcfcfc"} handleClick={() => setCurrent((prev) => prev + 1)}
                                      disabled={current === pageCount}/>
                        <Select variant={"outlined"} sx={{
                            fontSize: {xs: '10px', sm: '16px'}
                        }} color={"info"} displayEmpty required
                                inputProps={{'aria-label': 'Without label'}} defaultValue={10}
                                onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}>
                            {
                                [10, 20, 30, 40, 50].map((size) => (
                                    <MenuItem key={size} sx={{
                                        fontSize: {xs: '14px', sm: '16px'}
                                    }} value={size}>{translate("home.pages.show")} {size}</MenuItem>
                                ))
                            }
                        </Select>
                    </Box>
                )
            }
        </Box>
    );
};
export default AllInstitutions;
