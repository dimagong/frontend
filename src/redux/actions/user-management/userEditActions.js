export const setEditUser = (user) => {
    return {
        type: "SET_EDIT_USER",
        payload: { ...user }
    }
}