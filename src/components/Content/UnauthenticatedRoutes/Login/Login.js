/*
import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import s from "./Login.module.css";
import { Auth } from "aws-amplify";
import LoaderButton from "../../LoaderButton/LoaderButton";
import {useFormFields} from "../../../../libs/hooksLib";

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

        await Auth.signIn(fields.username, fields.password).then(()=>{
            props.userHasAuthenticated(true);
            props.history.push("/");
        }).catch (e => {
            alert(e.message);
            setIsLoading(false);
        });
    }

    return (
        <div className={s.Login}>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username">
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.username}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel>Пароль</FormLabel>
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
                    Войти
                </LoaderButton>
            </form>
        </div>
    );
}*/
