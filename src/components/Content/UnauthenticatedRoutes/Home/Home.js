import React from "react";
import s from "./Home.module.css";
import {Nav} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export default function Home(props) {
    return (
        <div className={s.Home}>
            {props.isAuthenticated ?
                <>
                    <h1>Home when you are authenticated</h1>
                </> :
                <>
                    <ul className={s.nobull}>
                        <li>
                            <LinkContainer to="/signup">
                                <Nav.Link>Присоединиться</Nav.Link>
                            </LinkContainer>
                        </li>
                        <li>
                            <LinkContainer to="/rules">
                                <Nav.Link>Правила</Nav.Link>
                            </LinkContainer>
                        </li>
                    </ul>
                </>
            }
        </div>
    );
}