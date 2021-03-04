import { combineReducers } from "redux"
import { userEditingReducer } from "./userEditingReducer"
import { InvitationsReducer } from "./invitationsReducer"

const userManagementReducers = combineReducers({
    userEditing: userEditingReducer,
    invitations: InvitationsReducer
})

export default userManagementReducers