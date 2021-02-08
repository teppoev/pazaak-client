import {Nav, Navbar} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import React from "react";
import {Auth} from "aws-amplify";

export default function AuthenticatedNavbarCollapse(props) {
    const history = useHistory();

    async function handleLogout() {
        await Auth.signOut();
        props.setIsAuthenticated(false);
        history.push("/login");
    }

    return (
        <Navbar.Collapse id="head-navbar">
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/play">{props.t.Play}</Nav.Link>
                <Nav.Link as={Link} to="/rules">{props.t.Rules}</Nav.Link>
                <Nav.Link as={Link} to="/shop">{props.t.Shop}</Nav.Link>
                <Nav.Link as={Link} to="/top">{props.t.Top}</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link as={Link} to="/profile">{props.t.Profile}</Nav.Link>
                <Nav.Link onClick={handleLogout}>{props.t.Logout}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    )
}
