import React, { createContext, useReducer } from "react";

import jwtDecode from "jwt-decode";

import SplashScreen from "../components/SlashScreen";
import authHeader from "../services/auth-header";
import { API_BASE } from "../utils/constants";
import axios from "../utils/axios";
import useEffectOnce from "../hooks/useEffectOnce";

const initialAuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: {},
    lastVisitedPatient: null,
};

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem("accessToken");
        delete axios.defaults.headers.common.Authorization;
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INITIALIZE": {
            const { isAuthenticated, user } = action.payload;
            return {
                ...state,
                isAuthenticated,
                isINITIALIZEd: true,
                user,
            };
        }
        case "LOGIN": {
            const { user } = action.payload;
            return {
                ...state,
                isAuthenticated: true,
                user,
            };
        }
        case "LOGOUT": {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        }
        default: {
            return { ...state };
        }
    }
};

const AuthContext = createContext({
    ...initialAuthState,
    method: "JWT",
    login: () => Promise.resolve(),
    logout: () => {},
    setUser: () => {},
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialAuthState);

    const login = async (email, password) => {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email,
            password,
        });
        const { accessToken, user } = response.data.data;
        setSession(accessToken);

        dispatch({
            type: "LOGIN",
            payload: {
                user,
            },
        });
    };

    const setUser = async (user, accessToken) => {
        setSession(accessToken);
        dispatch({
            type: "LOGIN",
            payload: {
                user,
            },
        });
    };

    const logout = () => {
        localStorage.clear();
        setSession(null);
        dispatch({ type: "LOGOUT" });
    };

    useEffectOnce(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem("accessToken");
                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken);

                    let fetchURL = `${API_BASE}/myself/profile`;

                    const response = await axios.get(fetchURL, {
                        headers: authHeader(),
                    });
                    const user = response.data.data;

                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            ...state,
                            isAuthenticated: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: "INITIALIZE",
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                dispatch({
                    type: "INITIALIZE",
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!state.isINITIALIZEd) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: "JWT",
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
