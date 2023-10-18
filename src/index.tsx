import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginScreen, HomeScreen, WelcomeSplash, TagList, DocList, TagDetail, EditingScreen} from './routes';
import store from "./app/store";
import { Provider } from "react-redux";
import '@fontsource/roboto/300.css'
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
                path : '/home/tags/:tagSlug',
                element : <TagDetail />,
            },

        ],
    },
    {
        path : '/home/docs/:docId',
        element : <EditingScreen />,
    }
    
])

ReactDOM.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>,
    document.getElementById('root'));