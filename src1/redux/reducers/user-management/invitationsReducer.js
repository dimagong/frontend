export const InvitationsReducer = (state = {
    list: []
}, action) => {
    switch (action.type) {
        case "SET_INVITATIONS_LIST": {
            return { ...state,  list: action.payload.list }
        }
        default: {
            return state
        }
    }
}
