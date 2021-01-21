import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";

export default function UnauthenticatedNavbarCollapse(props) {
    return (
        <Navbar.Collapse id="head-navbar">
            <Nav className="mr-auto"/>
            <Nav>
                <Nav.Link as={Link} to="/signup">Регистрация</Nav.Link>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    )
}