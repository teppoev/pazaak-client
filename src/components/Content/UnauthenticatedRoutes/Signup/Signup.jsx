import React, {useState} from "react";
import {useFormFields} from "../../../../libs/hooksLib";
import {FormControl, FormGroup, FormLabel} from "react-bootstrap";
import LoaderButton from "../../LoaderButton/LoaderButton";
import {Auth} from "aws-amplify";
import s from "./Signup.module.css";

export default function Signup(props) {
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.username,
                password: fields.password,
                attributes: {
                    email: fields.email
                }
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }
    function validateForm() {
        return (
            fields.username.length > 0 &&
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    return (
        <div className={s.Signup}>
            {newUser ? props.t.CheckEmailMessage :
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
                            type="password"
                            value={fields.password}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="confirmPassword">
                        <FormLabel>{props.t.ConfirmPassword}</FormLabel>
                        <FormControl
                            type="password"
                            onChange={handleFieldChange}
                            value={fields.ConfirmPassword}
                        />
                    </FormGroup>
                    <FormGroup controlId="email">
                        <FormLabel>{props.t.Email}</FormLabel>
                        <FormControl
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                    <LoaderButton
                        variant="outline-success"
                        block
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        {props.t.Signup}
                    </LoaderButton>
                </form>}
        </div>
    );
}