import React from "react";
import AuthenticatedRoutes from "./AuthenticatedRoutes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./UnauthenticatedRoutes/UnauthenticatedRoutes";

export default function Content(props) {
    return (
        <div>
            {props.isAuthenticated ? <AuthenticatedRoutes/> : <UnauthenticatedRoutes/>}
        </div>
    )
}