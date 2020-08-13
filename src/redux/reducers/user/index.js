import { combineReducers } from "redux"
import { profile, list } from "./userReducer"

const userReducers = combineReducers({
    profile: profile,
    list: list
})

export default userReducers