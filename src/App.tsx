import {Refine, Authenticated, I18nProvider, handleUseParams} from "@refinedev/core";

import {
    notificationProvider,
    RefineSnackbarProvider,
    ErrorComponent,
} from "@refinedev/mui";

import dataProvider from "@refinedev/simple-rest";
import { CssBaseline, GlobalStyles } from "@mui/material";
import {BrowserRouter, Route, Routes, Outlet, useParams, useLocation} from "react-router-dom";
import routerBindings, {
    NavigateToResource,
    CatchAllNavigate,
    UnsavedChangesNotifier,
    RefineRoutes
} from "@refinedev/react-router-v6";
import {newEnforcer} from "casbin.js"
import { useTranslation } from "react-i18next";
import { ColorModeContextProvider } from "./contexts";
import { Header, Sider, Title, Layout } from "./components/layout";
import {
    AllInstitutions, Drinker, EditProfile, ForgotPassword, Login, Register, TopInstitutions,
    UpdatePassword,
    VerifyNumber, Welcome
} from "pages";
import {
    Favorite,
    Group,
    Home,
    Newspaper,
    OtherHouses,
    Person,
    Reviews,
    Star,
    WineBar
} from "@mui/icons-material";

import { authProvider, axiosInstance } from "./authProvider";
import { useState, useLayoutEffect } from "react";
import { CreateInstitution, Profile, InstitutionDetails, AllNews, AllPlaces, AllReviews, AllUsers } from "components";
import { parseJwt } from "utils/parse-jwt";
import {model, adapter} from "accessControl";


function App() {
    const {t, i18n} = useTranslation()

    const [role, setRole] = useState("");

    useLayoutEffect(() => {
        const data: any = localStorage.getItem("user")
        if (data) {
            const res = parseJwt(data);
            if (res?._doc) {
                setRole(res?._doc?.isAdmin ? "admin" : "user")
            } else {
                setRole(res?.isAdmin ? "admin" : "user")
            }
        }
    }, [localStorage])

    const i18nProvider: I18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    const API_URL = process.env.REACT_APP_API;

    return (
        <BrowserRouter>
            <ColorModeContextProvider>
                <CssBaseline />
                <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
                <RefineSnackbarProvider>
                    <Refine
                        dataProvider={dataProvider(`${API_URL}/api/v1`, axiosInstance)}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "home",
                                meta: {
                                    icon: <Home/>,
                                    label: 'Home',
                                },
                                list: '/home',
                                show: '/home/show/:id',
                                create: '/home/create',
                            },
                            {
                                name: "top-institutions",
                                list: '/top-institutions',
                                meta: {
                                    icon: <Star/>,
                                    label: "Top Institutions"
                                },
                                show: '/top-institutions/show/:id',
                            },
                            {
                                name: "drinker",
                                list: '/drinker',
                                meta: {
                                    icon: <WineBar/>,
                                    label: 'Drinker'
                                },
                            },
                            {
                                name: "profile",
                                list: '/profile',
                                meta: {
                                    icon: <Person/>,
                                    label: "Profile"
                                },
                                edit: '/profile/edit/:id'
                            },
                            {
                                name: "all-places",
                                list: '/all-places',
                                meta: {
                                    icon: <OtherHouses/>,
                                    label: "All Places"
                                },
                            },
                            {
                                name: "favorite-places",
                                list: '/favorite-places',
                                meta: {
                                    icon: <Favorite/>,
                                    label: 'Favorite places'
                                },
                            },
                            {
                                name: "my-review",
                                list: '/my-review',
                                meta: {
                                    icon: <Reviews/>,
                                    label: 'My reviews'
                                },
                            },
                            {
                                name: "all-users",
                                list: '/all-users',
                                meta: {
                                    icon: <Group/>,
                                    label: "All users"
                                },
                            },
                            {
                                name: "all-review",
                                list: '/all-reviews',
                                meta: {
                                    icon: <Reviews/>,
                                    label: "All reviews"
                                },
                            },
                            {
                                name: "all-news",
                                list: '/all-news',
                                identifier: '/all-news',
                                meta: {
                                    icon: <Newspaper/>,
                                    label: 'All news'
                                },
                            }
                        ]}
                        accessControlProvider={{
                            can: async ({action, params, resource}) => {
                                const enforcer = await newEnforcer(model, adapter);

                                if (action === "delete" || action === "edit" || action === "show") {
                                    return Promise.resolve({
                                        can: await enforcer.enforce(
                                            role,
                                            `${resource}/${params?.id}`,
                                            action
                                        )
                                    });
                                }
                                if (action === "field") {
                                    return Promise.resolve({
                                        can: await enforcer.enforce(
                                            role,
                                            `${resource}/${params?.field}`,
                                            action
                                        )
                                    });
                                }

                                const can = await enforcer.enforce(role, resource, action);
                                return Promise.resolve({
                                    can
                                });
                            }
                        }}
                        routerProvider={routerBindings}
                        //     routes: [
                        //         {
                        //             path: '/welcome',
                        //             element: <Welcome/>
                        //         },
                        //         {
                        //             path: '/login',
                        //             element: <Login/>
                        //         },
                        //         {
                        //             path: "/register",
                        //             element: <Register/>,
                        //         },
                        //         {
                        //             path: '/verifyNumber/:token',
                        //             element: <VerifyNumber/>,
                        //         },
                        //         {
                        //             path: "/forgot-password",
                        //             element: <ForgotPassword/>,
                        //         },
                        //         {
                        //             path: `/update-password/:token`,
                        //             element: <UpdatePassword/>,
                        //         },
                        //     ],
                        // }}

                        authProvider={authProvider}
                        i18nProvider={i18nProvider}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated v3LegacyAuthProviderCompatible={false}
                                        fallback={
                                            <CatchAllNavigate to="welcome"/>
                                        }
                                    >
                                        <Layout Header={Header} Sider={Sider} Title={Title}>
                                            <Outlet/>
                                        </Layout>
                                    </Authenticated>
                                }
                            >
                                <Route
                                    index
                                    element={
                                        <NavigateToResource/>
                                    }
                                />

                                <Route path="/home">
                                    <Route index element={<AllInstitutions/>}/>
                                    <Route
                                        path="create"
                                        element={<CreateInstitution/>}
                                    />
                                    <Route
                                        path="show/:id"
                                        element={<InstitutionDetails/>}/>
                                </Route>
                                <Route path={'/profile'}>
                                    <Route index element={<Profile/>}/>
                                    <Route path={'edit'} element={<EditProfile/>}/>
                                </Route>
                                <Route path={'/drinker'}>
                                    <Route index element={<Drinker/>}/>
                                </Route>
                                <Route path={'/all-news'}>
                                    <Route index element={<AllNews/>}/>
                                </Route>
                                <Route path={'/all-reviews'}>
                                    <Route index element={<AllReviews/>}/>
                                </Route>
                                <Route path={'/all-users'}>
                                    <Route index element={<AllUsers/>}/>
                                </Route>
                                <Route path={'/all-news'}>
                                    <Route index element={<AllNews/>}/>
                                </Route>
                                <Route path={'/all-places'}>
                                    <Route index element={<AllPlaces/>}/>
                                </Route>
                                <Route path={'/top-institutions'}>
                                    <Route index element={<TopInstitutions/>}/>
                                </Route>
                                <Route path="*" element={<ErrorComponent/>}/>
                            </Route>

                            <Route
                                element={
                                    <Authenticated v3LegacyAuthProviderCompatible={true} fallback={<Outlet/>}>
                                        <NavigateToResource resource={"home"}/>
                                    </Authenticated>
                                }
                            >
                                <Route index element={<Welcome/>}/>
                                <Route
                                    path="/login"
                                    element={<Login/>}
                                />
                                <Route
                                    path='/welcome'
                                    element={<Welcome/>}
                                />
                                <Route
                                    path="/register"
                                    element={<Register/>}
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword/>}
                                />
                                <Route
                                    path="/update-password"
                                    element={<UpdatePassword/>}
                                />

                                <Route
                                    path="/verifyNumber"
                                    element={<VerifyNumber/>}
                                />
                            </Route>

                            <Route
                                element={
                                    <Authenticated v3LegacyAuthProviderCompatible={true} >
                                        <Layout Header={Header} Sider={Sider} Title={Title}>
                                            <Outlet/>
                                        </Layout>
                                    </Authenticated>
                                }
                            >
                                <Route path="*" element={<ErrorComponent/>}/>
                            </Route>
                        </Routes>

                        <UnsavedChangesNotifier />
                    </Refine>
                </RefineSnackbarProvider>
            </ColorModeContextProvider>
        </BrowserRouter>
    );
}

export default App;

