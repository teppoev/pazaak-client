import React, {useEffect, useState} from "react"

import Header from "./components/Header/Header";
import Content from "./components/Content/Content";

import s from './App.module.css'
import {Auth} from "aws-amplify";

export default function App(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        async function checkIfUserHasAuthenticated() {
            try {
                await Auth.currentSession();
                setIsAuthenticated(true);
            } catch (e) {
                if (e !== 'No current user') {
                    alert(e);
                }
            }
            setIsAuthenticating(false);
        }

        checkIfUserHasAuthenticated();
    }, []) //'[]' means that this hook will run only when component mounts

    return (
        !isAuthenticating &&
        <div className={s.app_wrapper}>
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} t={props.t.Header}/>
            <Content isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} t={props.t.Content}/>
        </div>
    )
}