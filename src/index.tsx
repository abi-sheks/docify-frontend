import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginScreen, HomeScreen, WelcomeSplash, TagList, DocList, TagDetail, EditingScreen, RegisterScreen, ErrorPage } from './routes';
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
        element: <LoginScreen />,
        errorElement: <ErrorPage />
    },
    {
        path: '/register',
        element: <RegisterScreen />,
        errorElement: <ErrorPage />
    },
    {
        path: '/home',
        element: <HomeScreen />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/home/",
                element: <WelcomeSplash />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/home/docs',
                element: <DocList />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/home/tags',
                element: <TagList />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/home/tags/:tagId',
                element: <TagDetail />,
                errorElement: <ErrorPage />,
            },

        ],
    },
    {
        path: '/home/docs/:docId/:access',
        element: <EditingScreen />,
        errorElement: <ErrorPage />,
    }

])

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>,
    document.getElementById('root'));