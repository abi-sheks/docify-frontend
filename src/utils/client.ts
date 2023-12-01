//@ts-nocheck
import axios from 'axios';
import getCookie from './getCookie';

const csrftoken = getCookie("csrftoken")
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = csrftoken;

export const BackendClient = axios.create({
    baseURL: "http://localhost:8000/api/auth/",
    withCredentials: true,
  });

