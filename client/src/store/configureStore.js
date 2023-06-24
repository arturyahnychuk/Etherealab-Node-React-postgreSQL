import { applyMiddleware, legacy_createStore as createStore } from "redux";
import thunkMiddleware from "redux-thunk";

// import monitorReducersEnhancer from "./enhancers/monitorReducer";
// import loggerMiddleware from "./middleware/logger";
import rootReducer from "./reducers";

export default function configureStore(preloadedState) {
    const middlewares = [thunkMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer, monitorReducersEnhancer];

    const store = createStore(rootReducer, preloadedState, enhancers);

    return store;
}
