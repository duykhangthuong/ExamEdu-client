import { combineReducers } from "redux";
import userReducer from "./user";

const combinedReducer = combineReducers({ user: userReducer });

export default combinedReducer;
