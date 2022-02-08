export const LOGIN = "user/login";
export const LOGOUT = "user/logout";

export const login = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem(
        "examedu",
        JSON.stringify({
            accountId: data.accountId,
            email: data.email,
            fullname: data.fullname,
            role: data.role,
        })
    );

    return {
        type: LOGIN,
        payload: {
            accountId: data.accountId,
            email: data.email,
            fullname: data.fullname,
            role: data.role,
        },
    };
};
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("examedu");

    return {
        type: LOGOUT,
    };
};
