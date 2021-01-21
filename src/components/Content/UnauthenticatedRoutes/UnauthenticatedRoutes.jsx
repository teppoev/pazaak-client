import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./Home/Home";
import Rules from "../Rules/Rules";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import NotFound from "../NotFound/NotFound";

export default function UnauthenticatedRoutes() {
    return (
        <Switch>
            <Route path="/" exact render={() => <Home/>}/>
            <Route path="/rules" exact render={() => <Rules/>}/>
            <Redirect from="/profile" to="/login"/>
            <Redirect from="/play" to="/login"/>
            <Redirect from="/shop" to="/login"/>
            <Redirect from="/top" to="/login"/>
            <Route path='/login' exact render={() => <Login/>}/>
            <Route path='/signup' exact render={() => <Signup/>}/>
            <Route component={NotFound}/>
        </Switch>
    )
}