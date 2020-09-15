export const navConfig = (state = {headTitle: ''}, action) => {
    switch (action.type) {
        case "SET_NAV_BAR_HEAD_TEXT": {
            return { ...state, ...action.payload }
        }
        default: {
            return state
        }
    }
}
