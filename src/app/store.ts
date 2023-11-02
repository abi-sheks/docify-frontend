import {configureStore} from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import userReducer from '../features/user/userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key : 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, userReducer)


export const store = configureStore({
    reducer : {
        [apiSlice.reducerPath] : apiSlice.reducer,
        user : persistedReducer,
    },
    middleware : (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware)
}
)

export const persistor = persistStore(store)


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

