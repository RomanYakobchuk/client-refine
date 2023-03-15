import axios, {AxiosRequestConfig} from "axios";
import {parseJwt} from "utils/parse-jwt";
import {IData, ProfileProps} from "./interfaces/common";
import {AuthBindings} from "@refinedev/core";

export const ACCESS_TOKEN_KEY = "access-refine-auth";
export const REFRESH_TOKEN_KEY = "refresh-refine-auth";

const baseURL = `${process.env.REACT_APP_API}/api/v1`;

export const axiosInstance = axios.create({
    baseURL, headers: {
        'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
    }
});

axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (request.headers) {
        request.headers["Authorization"] = `${access_token}`;
    } else {
        request.headers = {
            Authorization: `${access_token}`,
        };
    }

    return request;
});


export const authProvider: AuthBindings = {
        login: async ({user, access_token, refresh_token}: IData): Promise<any> => {

            if (user) {
                const profileObj = user ? parseJwt(user) : null;

                if (profileObj) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                    localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
                    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)

                    return {
                        authenticated: true,
                        success: true,
                        redirectTo: '/home'
                    }
                } else {
                    return {
                        success: false
                    }
                }
            }
            return {
                success: false
            };
        },
        logout: async () => {
            await axiosInstance.get('/auth/logout')
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem("user");
            return {
                success: false,
                redirectTo: '/login'
            };
        },
        onError: async (error) => {
            console.log(error)
            return {error}
        },
        check: async () => {
            const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
            const dateNow = new Date();
            if (!access_token && !refresh_token) {
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    success: false,
                    redirectTo: '/login'
                }
            } else if (access_token && refresh_token) {
                const token_a = parseJwt(access_token);
                const token_r = parseJwt(refresh_token);
                if (token_a?.exp * 1000 > dateNow.getTime()) {
                    return {
                        authenticated: true
                    };
                } else if (token_a?.exp * 1000 < dateNow.getTime() && token_r?.exp * 1000 > dateNow.getTime()) {
                    const {data} = await axiosInstance.post('/auth/refreshToken', {
                        refresh_token
                    })
                    if (data) {
                        localStorage.setItem(ACCESS_TOKEN_KEY, data?.access_token)
                        localStorage.setItem(REFRESH_TOKEN_KEY, data?.refresh_token)
                        localStorage.setItem("user", data?.user)
                        return {
                            authenticated: true
                        }
                    }

                    return {
                        authenticated: false,
                        error: new Error("Not authenticated"),
                        logout: true,
                        redirectTo: '/login'
                    };

                }
                return {
                    authenticated: false,
                    error: new Error("Not authenticated"),
                    logout: true,
                    redirectTo: '/login'
                };
            }
            return {
                authenticated: false,
                error: new Error("Not authenticated"),
                logout: true,
                redirectTo: '/login'
            };
        },
        getPermissions: async () => null,
        getIdentity: async () => {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const user = localStorage.getItem("user");
            if (!token) {
                return null;
            }
            const data = user ? parseJwt(user) : null;

            if (!data) return null

            return Promise.resolve<ProfileProps>(data?._doc ?? data);
        },
    }
;
