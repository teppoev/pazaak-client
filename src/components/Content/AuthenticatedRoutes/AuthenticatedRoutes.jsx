import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Rules from "../Rules/Rules";
import Profile from "./Profile/Profile";
import Play from "./Play/Play";
import Shop from "./Shop/Shop";
import Top from "./Top/Top";
import NotFound from "../NotFound/NotFound";

export default function AuthenticatedRoutes() {
    return (
        <Switch>
            <Route path='/rules' exact render={() => <Rules/>}/>
            <Route path='/profile' exact render={() => <Profile/>}/>
            <Route path='/play' exact render={() => <Play/>}/>
            <Route path='/shop' exact render={() => <Shop/>}/>
            <Route path='/top' exact render={() => <Top/>}/>
            <Redirect from="/" to="/play"/>
            <Redirect from="/login" to="/profile"/>
            <Redirect from="/signup" to="/profile"/>
            <Route component={NotFound}/>
        </Switch>
    )
}