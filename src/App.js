import React from "react";
import {Image, Nav, Navbar} from "react-bootstrap";
import "./App.css";
import Routes from "./containers/Routes/Routes";

function App(props) {
    return (
        <div className="App container">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">
                    <Image src="https://sun9-54.userapi.com/jrNusnwCntVjQNjhVzjCEN3fQaxovEIEBA_Yyw/ry3a-B8x9bA.jpg?ava=1" height="50px"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/play">Играть</Nav.Link>
                        <Nav.Link href="/rules">Правила</Nav.Link>
                        <Nav.Link href="/shop">Магазин</Nav.Link>
                        <Nav.Link href="/shop">Рекорды</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/profile">Профиль</Nav.Link>
                        <Nav.Link href="/logout">Выйти</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes />
        </div>
    );
}

export default App;