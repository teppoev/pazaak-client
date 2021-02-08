import React from "react";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import s from "./UnauthenticatedHome.module.css";

export default function UnauthenticatedHome(props) {
    return (
        <Nav className={`${s.home} flex-column`}>
            <Nav.Link as={Link} to="/signup">{props.t.Join}</Nav.Link>
            <Nav.Link as={Link} to="/rules">{props.t.Rules}</Nav.Link>
        </Nav>
    )
}