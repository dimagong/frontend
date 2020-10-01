import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"
import userReducers from "./user/userReducers"
import groupReducer from "./group/groupReducers"
import roleReducers from "./role/roleReducers"
import moduleReducers from "./module/moduleReducers"
import dFormReducer from "./onboarding/dFormReducers"
import workflowReducer from "./onboarding/workflowReducers"

const appReducer = {
...authReducer,
...notificationsReducer,
...userReducers,
...groupReducer,
...dFormReducer,
...workflowReducer,
...roleReducers,
...moduleReducers,
}

export default appReducer;
