import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Rules from "../Rules/Rules";
import Profile from "./Profile/Profile";
import Play from "./Play/Play";
import Shop from "./Shop/Shop";
import Top from "./Top/Top";
import NotFound from "../NotFound/NotFound";
import AuthenticatedHome from "./AuthenticatedHome/AuthenticatedHome";

export default function AuthenticatedRoutes(props) {
    return (
        <Switch>
            <Route path='/' exact render={() => <AuthenticatedHome t={props.t.AuthenticatedHome}/>}/>
            <Route path='/rules' exact render={() => <Rules t={props.Rules}/>}/>
            <Route path='/profile' exact render={() => <Profile t={props.t.Profile} Loading={props.t.Loading}/>}/>
            <Route path='/play' exact render={() => <Play t={props.t.Play}/>}/>
            <Route path='/shop' exact render={() => <Shop t={props.t.Shop} Loading={props.t.Loading}/>}/>
            <Route path='/top' exact render={() => <Top t={props.t.Top} Loading={props.t.Loading}/>}/>
            <Redirect from="/login" to="/profile"/>
            <Redirect from="/signup" to="/profile"/>
            <Route render={() => <NotFound />}/>
        </Switch>
    )
}