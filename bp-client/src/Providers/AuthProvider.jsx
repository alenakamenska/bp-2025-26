import React, { createContext, useReducer, useContext } from "react";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const CLEAR_ACCESS_TOKEN = "CLEAR_ACCESS_TOKEN";

const parseJwt = (token) => {
    if (!token) return {};
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    } catch (e) {
        return {};
    }
};

const storedToken = localStorage.getItem("token");
let storedUser = null;

if (storedToken) {
    storedUser = parseJwt(storedToken); 
}

const initialState = {
    accessToken: storedToken || null,
    userId: storedUser ? storedUser.sub : null,
    profile: storedUser || null
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            let tokenData = parseJwt(action.payload);
            return { ...state, accessToken: action.payload, userId: tokenData.sub, profile: tokenData }
        case CLEAR_ACCESS_TOKEN:
            return { ...state, accessToken: null, userId: null, profile: null }
        default: return state;
    }
}

export const AuthContext = createContext([initialState, () => {}]);
export const AuthProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AuthContext.Provider value={[state, dispatch]}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);