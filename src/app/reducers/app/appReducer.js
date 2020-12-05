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
import masterSchemaReducer from './masterSchema/masterSchemaReducer'

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
  ...masterSchemaReducer,
}

export default appReducer;
