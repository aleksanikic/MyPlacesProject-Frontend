import React, { useCallback, useState } from "react";

export function useAuth() {
    const [token, setToken] = useState(null);
    const [tokenExpirationDateState, setTokenExpirationDateState] =
        useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDateState(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                expirationDate: tokenExpirationDate.toISOString(),
            }),
        );
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDateState(null);
        localStorage.removeItem("userData");
    }, []);

    React.useEffect(() => {
        if (!token || !tokenExpirationDateState) {
            return;
        }

        const remainingTime =
            tokenExpirationDateState.getTime() - new Date().getTime();
        const logoutTimer = setTimeout(logout, remainingTime);

        return () => clearTimeout(logoutTimer);
    }, [token, tokenExpirationDateState, logout]);

    React.useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expirationDate) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expirationDate),
            );
        }
    }, [login]);

    return { token, login, logout, userId };
}
