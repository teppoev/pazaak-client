import React from "react";
import AuthenticatedRoutes from "./AuthenticatedRoutes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./UnauthenticatedRoutes/UnauthenticatedRoutes";

export default function Content(props) {
    return (
        <div>
            {
                props.isAuthenticated ?
                    <AuthenticatedRoutes
                        accessTokenAPI={props.accessTokenAPI}
                        t={props.t.AuthenticatedRoutes}
                        Rules={props.t.Rules}
                        NotFound={props.t.NotFound}/> :
                    <UnauthenticatedRoutes
                        setIsAuthenticated={props.setIsAuthenticated}
                        accessTokenAPI={props.accessTokenAPI}
                        t={props.t.UnauthenticatedRoutes}
                        Rules={props.t.Rules}
                        NotFound={props.t.NotFound}/>
            }
        </div>
    )
}