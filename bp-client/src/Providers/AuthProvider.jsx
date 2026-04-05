import React, { createContext, useReducer, useContext, useEffect } from "react";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const CLEAR_ACCESS_TOKEN = "CLEAR_ACCESS_TOKEN";

const parseJwt = (token) => {
    if (!token) return null; 
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); 
        const data = JSON.parse(window.atob(base64));
        if (data.exp && data.exp * 1000 < Date.now()) {
            return null; 
        }
        return data;
    } catch (e) {
        console.error("Chyba při parsování JWT:", e);
        return null;
    }
};

const storedToken = localStorage.getItem("token");
const storedUser = parseJwt(storedToken);

if (storedToken && !storedUser) {
    localStorage.removeItem("token");
}

const initialState = {
    accessToken: storedUser ? storedToken : null,
    userId: storedUser ? (storedUser.sub || storedUser["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]) : null,
    profile: storedUser || null
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            const token = action.payload;
            const tokenData = parseJwt(token);
            if (!tokenData) return state;
            localStorage.setItem("token", token);

            return { 
                ...state, 
                accessToken: token, 
                userId: tokenData.sub || tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], 
                profile: tokenData 
            };

        case CLEAR_ACCESS_TOKEN:
            localStorage.removeItem("token");
            return { 
                ...state, 
                accessToken: null, 
                userId: null, 
                profile: null 
            };

        default: 
            return state;
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const checkToken = () => {
            if (state.accessToken) {
                const decoded = parseJwt(state.accessToken);
                if (!decoded) {
                    console.warn("Token vypršel nebo je neplatný, odhlašuji uživatele...");
                    dispatch({ type: CLEAR_ACCESS_TOKEN });
                }
            }
        };

        checkToken();
        const interval = setInterval(checkToken, 60000); 
        
        return () => clearInterval(interval);
    }, [state.accessToken]);

    return (
        <AuthContext.Provider value={[state, dispatch]}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext musí být použit uvnitř AuthProvideru");
    }
    return context;
};