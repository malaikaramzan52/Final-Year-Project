import { configureStore } from '@reduxjs/toolkit';
// import userReducer from "./userSlice.js";
import {user, userReducer} from "./reducers/user.js"; 
const Store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default Store;