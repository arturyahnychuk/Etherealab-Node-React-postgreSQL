import { combineReducers } from "redux";

import commonReducer from "./common";
import notificationsReducer from "./notifications";
import patientReducer from "./patient/reducer";

const appReducer = combineReducers({
    patient: patientReducer,
    common: commonReducer,
    notifications: notificationsReducer,
});

/* eslint-disable */
const reducer = (state, action) => {
    if (action.type === "LOGOUT") {
        state = undefined;
    }
    return appReducer(state, action);
};
/* eslint-enable */
export default reducer;
