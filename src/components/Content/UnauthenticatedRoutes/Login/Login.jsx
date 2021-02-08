import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import s from "./Login.module.css";
import LoaderButton from "../../LoaderButton/LoaderButton";
import {useFormFields} from "../../../../libs/hooksLib";
import {useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";

export default function Login(props) {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        await Auth.signIn(fields.username, fields.password).then(()=>{
            props.setIsAuthenticated(true);
            history.push("/");
        }).catch (e => {
            alert(e.message);
            setIsLoading(false);
        });
    }
    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    return (
        <div className={s.Login}>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username">
                    <FormLabel>{props.t.Username}</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.username}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel>{props.t.Password}</FormLabel>
                    <FormControl
                        value={fields.password}
                        onChange={handleFieldChange}
                        type="password"
                    />
                </FormGroup>
                <LoaderButton
                    variant="outline-success"
                    block
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    {props.t.Login}
                </LoaderButton>
            </form>
        </div>
    );
}
