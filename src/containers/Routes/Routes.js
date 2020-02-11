import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppliedRoute from "../../components/AppliedRoute/AppliedRoute";
import Home from "./../Home/Home";
import Login from "./../Login/Login";
import Signup from "../Signup/Signup";
import NotFound from "../NotFound/NotFound";
import Rules from "../Rules/Rules";
import Profile from "../Profile/Profile";
import Play from "../Play/Play";
import Shop from "../Shop/Shop";
import Top from "../Top/Top";

export default function Routes({appProps}) {
    return (
        <div>
            {appProps.isAuthenticated ?
                <Switch>
                    <AppliedRoute path="/rules" exact component={Rules} appProps={appProps}/>
                    <AppliedRoute path="/profile" exact component={Profile} appProps={appProps}/>
                    <AppliedRoute path="/play" exact component={Play} appProps={appProps}/>
                    <AppliedRoute path="/shop" exact component={Shop} appProps={appProps}/>
                    <AppliedRoute path="/top" exact component={Top} appProps={appProps}/>
                    <Redirect from="/" to="/play"/>
                    <Redirect from="/login" to="/profile"/>
                    <Redirect from="/signup" to="/profile"/>
                    <Route component={NotFound}/>
                </Switch>
                :
                <Switch>
                    <AppliedRoute path="/" exact component={Home} appProps={appProps}/>
                    <AppliedRoute path="/rules" exact component={Rules} appProps={appProps}/>
                    <Redirect from="/profile" to="/login"/>
                    <Redirect from="/play" to="/login"/>
                    <Redirect from="/shop" to="/login"/>
                    <Redirect from="/top" to="/login"/>
                    <AppliedRoute path="/login" exact component={Login} appProps={appProps}/>
                    <AppliedRoute path="/signup" exact component={Signup} appProps={appProps}/>
                    <Route component={NotFound}/>
                </Switch>
            }
        </div>
    );
}