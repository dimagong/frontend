import authReducer from "./auth/authReducer"
import notificationsReducer from "./onboarding/notificationsReducer"

const appReducer = {
...authReducer,
...notificationsReducer,
}

export default appReducer;
