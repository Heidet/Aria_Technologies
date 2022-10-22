import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './views/Login';
import Map from './views/Map';

import PageNotFound from "./views/Errors/Error404"
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext";
import  {GradientChart}   from "./views/Charts/Chart";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-timezone';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
moment.tz.setDefault("Europe/Paris");
ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* <Route element={<App />}  path="/" /> */}
        <Route element={<Map />}  path="/map" />
        <Route element={<Login />}  path="/" />

        <Route element={<GradientChart />}  path="/chart" />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
