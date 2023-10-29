import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginScreen, HomeScreen, WelcomeSplash, TagList, DocList, TagDetail, EditingScreen } from './routes';
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './global.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginScreen />
    },
    {
        path: '/home',
        element: <HomeScreen />,
        children: [
            {
                path: "/home/",
                element: <WelcomeSplash />,
            },
            {
                path: '/home/docs',
                element: <DocList />
            },
            {
                path: '/home/tags',
                element: <TagList />
            },
            {
                path: '/home/tags/:tagId',
                element: <TagDetail />,
            },

        ],
    },
    {
        path: '/home/docs/:docId',
        element: <EditingScreen />,
    }

])

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>,
    document.getElementById('root'));