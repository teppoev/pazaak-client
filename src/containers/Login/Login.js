import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import {useFormFields} from "../../libs/hooksLib";

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        password: ""
    });

    function validateForm() {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.username, fields.password);
            props.userHasAuthenticated(true);
            props.history.push("/");
        } catch (e) {
            if (e.message === "Incorrect username of password") {
                try {
                    await Auth.signIn(fields.username, fields.password);
                    props.userHasAuthenticated(true);
                    props.history.push("/");
                } catch(e) {
                    alert(e.message);
                    setIsLoading(false);
                }
            }
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.username}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <FormLabel>Пароль</FormLabel>
                    <FormControl
                        value={fields.password}
                        onChange={handleFieldChange}
                        type="password"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Войти
                </LoaderButton>
            </form>
        </div>
    );
}