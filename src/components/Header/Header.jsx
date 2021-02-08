import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

import AuthenticatedNavbarCollapse from "./AuthenticatedNavbarCollapse/AuthenticatedNavbarCollapse";
import UnauthenticatedNavbarCollapse from "./UnauthenticatedNavbarCollapse/UnauthenticatedNavbarCollapse";

export default function Header(props) {
    return (
        <Navbar bg="light" expand="sm">
            <Navbar.Brand>
                <Nav.Link as={Link} to="/">{props.t.NavbarBrand}</Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="head-navbar"/>
            {
                props.isAuthenticated ?
                    <AuthenticatedNavbarCollapse
                        setIsAuthenticated={props.setIsAuthenticated}
                        t={props.t.AuthenticatedNavbarCollapse}/> :
                    <UnauthenticatedNavbarCollapse
                        t={props.t.UnauthenticatedNavbarCollapse}/>
            }
        </Navbar>
    )
}