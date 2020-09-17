export const setUserProfile = (user) => {
    return {
        type: "SET_USER_PROFILE",
        payload: { ...user }
    }
}
export const setUserList = (users, nav) => {
    return {
        type: "SET_USERS_LIST",
        payload: {
            data: users, 
            nav: nav
        }
    }
}