import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./../Home/Home";
import Login from "./../Login/Login";
import NotFound from "../NotFound/NotFound";
import AppliedRoute from "../../components/AppliedRoute/AppliedRoute";
import Signup from "../Signup/Signup";

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
            <AppliedRoute path="/signup" exact component={Signup} appProps={appProps} />
            <Route component={NotFound}/>
        </Switch>
    );
}