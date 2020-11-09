import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"
import userReducers from "./user/userReducers"
import invitationReducers from "./invitation/invitationReducers"
import groupReducer from "./group/groupReducers"
import roleReducers from "./role/roleReducers"
import moduleReducers from "./module/moduleReducers"
import dFormReducer from "./onboarding/dFormReducers"
import workflowReducer from "./onboarding/workflowReducers"
import layoutReducer from './layout/layoutReducer'

const appReducer = {
  ...authReducer,
  ...notificationsReducer,
  ...userReducers,
  ...groupReducer,
  ...dFormReducer,
  ...workflowReducer,
  ...roleReducers,
  ...moduleReducers,
  ...invitationReducers,
  ...layoutReducer,
}

export default appReducer;
