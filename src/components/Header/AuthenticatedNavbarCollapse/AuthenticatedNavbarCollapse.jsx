import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";

export default function AuthenticatedNavbarCollapse(props) {
    return (
        <Navbar.Collapse id="head-navbar">
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/play">Играть</Nav.Link>
                <Nav.Link as={Link} to="/rules">Правила</Nav.Link>
                <Nav.Link as={Link} to="/shop">Магазин</Nav.Link>
                <Nav.Link as={Link} to="/top">Рекорды</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link as={Link} to="/profile">Профиль</Nav.Link>
                <Nav.Link onClick={props.handleLogout}>Выход</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    )
}
