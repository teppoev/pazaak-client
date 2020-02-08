import React, {useEffect, useState} from "react";
import {Nav, Navbar} from "react-bootstrap";
import "./App.css";
import Routes from "./containers/Routes/Routes";
import {Link, withRouter} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import { Auth } from "aws-amplify";

function App(props) {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        setIsAuthenticating(false);
    }

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);

        props.history.push("/login");
    }

    return (
        !isAuthenticating &&
        <div className="App container">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>
                    <Link to="/">Пазаак</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="head-navbar"/>
                <Navbar.Collapse id="head-navbar">
                    <Nav className="mr-auto">
                        {isAuthenticated
                            ? <>
                            <LinkContainer to="/play">
                                <Nav.Link>Играть</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/rules">
                                <Nav.Link>Правила</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/shop">
                                <Nav.Link>Магазин</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/top">
                                <Nav.Link>Рекорды</Nav.Link>
                            </LinkContainer>
                            </>
                            : <>
                            </>
                        }
                    </Nav>
                    <Nav>
                        {isAuthenticated
                            ? <>
                                <LinkContainer to="/profile">
                                    <Nav.Link>Профиль</Nav.Link>
                                </LinkContainer>
                                <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
                            </>
                            : <>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Регистрация</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <Nav.Link>Вход</Nav.Link>
                                </LinkContainer>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
        </div>
    );
}

export default withRouter(App);