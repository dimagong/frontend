export const profile = (state = {}, action) => {
    switch (action.type) {
        case "SET_USER_PROFILE": {
            return { ...state, ...action.payload }
        }
        default: {
            return state
        }
    }
}

export const list = (state = {
    data: [],
    nav: {
        pageSize: 10,
        currPage: 1,
        searchVal: "",
        total: 10
    }
}, action) => {

    switch (action.type) {

        case "SET_USERS_LIST": {
            return { ...state, ...action.payload }
        }
        default: {
            return state
        }
    }
}

