import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import AuthenticatedNavbarCollapse from "./AuthenticatedNavbarCollapse/AuthenticatedNavbarCollapse";
import UnauthenticatedNavbarCollapse from "./UnauthenticatedNavbarCollapse/UnauthenticatedNavbarCollapse";

export default function Header(props) {
    return (
        <Navbar bg="light" expand="sm">
            <Navbar.Brand>
                Pazaak
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="head-navbar"/>
            { props.isAuthenticated ? <AuthenticatedNavbarCollapse/> : <UnauthenticatedNavbarCollapse/> }
        </Navbar>
    )
}