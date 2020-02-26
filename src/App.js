import React, {useEffect, useState} from "react";
import {Image, Nav, Navbar} from "react-bootstrap";
import "./App.module.css";
import Routes from "./containers/Routes/Routes";
import {withRouter, Link} from "react-router-dom";
import {Auth} from "aws-amplify";

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
        } catch (e) {
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
        <div className="App container h-100">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand
                    as={Link}
                    to="/"
                >
                    <Image
                        src="https://external-preview.redd.it/L4S-dK5qg8lTwcfsNygBVLkIB52LicE2nZeG6XNQNgw.png?auto=webp&s=9815c18c109bcd48e74cceabcd8bcd4fa68b74e6"
                        height="60px"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="head-navbar"/>
                <Navbar.Collapse id="head-navbar">
                    <Nav className="mr-auto">
                        {isAuthenticated
                            ? <>
                                <Nav.Link as={Link} to="/play">Играть</Nav.Link>
                                <Nav.Link as={Link} to="/rules">Правила</Nav.Link>
                                <Nav.Link as={Link} to="/shop">Магазин</Nav.Link>
                                <Nav.Link as={Link} to="/top">Рекорды</Nav.Link>
                            </>
                            : <>
                            </>
                        }
                    </Nav>
                    <Nav>
                        {isAuthenticated
                            ? <>
                                <Nav.Link as={Link} to="/profile">Профиль</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
                            </>
                            : <>
                                <Nav.Link as={Link} to="/signup">Регистрация</Nav.Link>
                                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes appProps={{isAuthenticated, userHasAuthenticated}}/>
        </div>
    );
}

export default withRouter(App);