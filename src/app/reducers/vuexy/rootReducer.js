import { combineReducers } from "redux";
import calenderReducer from "./calendar";
import emailReducer from "./email";
import chatReducer from "./chat";
import todoReducer from "./todo";
import customizer from "./customizer";
import auth from "./auth";
import dataList from "./data-list";
import userReducer from "./user";
import userManagement from "./user-management";

const rootReducer = combineReducers({
  calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  user: userReducer,
  dataList: dataList,
  userManagement: userManagement,
});

export default rootReducer;
