import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import boardSlice from "./reducers/boardReducer";
import authSlice from "./reducers/authReducer";
import {loginApi} from './api/loginApi'
export const store = configureStore({
    reducer: {
        board: boardSlice.reducer,
        [loginApi.reducerPath]:loginApi.reducer,
        auth:authSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loginApi.middleware)
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
