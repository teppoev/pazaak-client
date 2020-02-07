import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./../Home/Home";
import NotFound from "../NotFound/NotFound";

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route component={NotFound}/>
        </Switch>
    );
}