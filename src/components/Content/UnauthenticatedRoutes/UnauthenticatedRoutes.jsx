import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Rules from "../Rules/Rules";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import NotFound from "../NotFound/NotFound";
import UnauthenticatedHome from "./UnauthenticatedHome/UnauthenticatedHome";

export default function UnauthenticatedRoutes(props) {
    return (
        <Switch>
            <Route path="/" exact render={() => <UnauthenticatedHome t={props.t.UnauthenticatedHome}/>}/>
            <Route path="/rules" exact render={() => <Rules t={props.Rules}/>}/>
            <Redirect from="/profile" to="/login"/>
            <Redirect from="/play" to="/login"/>
            <Redirect from="/shop" to="/login"/>
            <Redirect from="/top" to="/login"/>
            <Route path='/login' exact render={() => <Login setIsAuthenticated={props.setIsAuthenticated}
                                                            accessTokenAPI={props.accessTokenAPI}
                                                            t={props.t.Login}/>}/>
            <Route path='/signup' exact render={() => <Signup t={props.t.Signup}/>}/>
            <Route render={() => <NotFound t={props.NotFound}/>}/>
        </Switch>
    )
}