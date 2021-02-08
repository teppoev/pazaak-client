import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";

export default function UnauthenticatedNavbarCollapse(props) {
    return (
        <Navbar.Collapse id="head-navbar">
            <Nav className="mr-auto"/>
            <Nav>
                <Nav.Link as={Link} to="/signup">{props.t.Signup}</Nav.Link>
                <Nav.Link as={Link} to="/login">{props.t.Login}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    )
}