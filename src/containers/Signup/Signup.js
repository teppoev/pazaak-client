import {useFormFields} from "../../libs/hooksLib";
import React, {useState} from "react";
import {FormControl, FormGroup, FormLabel, FormText} from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton/LoaderButton";
import {API, Auth} from "aws-amplify";
import s from "./Signup.module.css";


export default function Signup(props) {
    const [fields, handleFieldChange] = useFormFields({
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.nickname.length > 0 &&
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.nickname,
                password: fields.password,
                attributes: {
                    email: fields.email
                }
            });
            setIsLoading(false);
            setNewUser(newUser);
        }
        catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.nickname, fields.confirmationCode);
            await Auth.signIn(fields.nickname, fields.password);
            await API.post("pazaak-rest", "/register");
            props.userHasAuthenticated(true);
            props.history.push("/");
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode">
                    <FormLabel>Введите код подтверждения</FormLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <FormText className="text-muted">Проверьте свой почтовый ящик.</FormText>
                </FormGroup>
                <LoaderButton
                    variant="outline-success"
                    block
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </form>
        );
    }

    function renderForm() {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="nickname">
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={fields.nickname}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel>Пароль</FormLabel>
                    <FormControl
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword">
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </FormGroup>
                <FormGroup controlId="email">
                    <FormLabel>Адрес электронной почты</FormLabel>
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
                    Зарегистрироваться
                </LoaderButton>
            </form>
        );
    }

    return (
        <div className={s.Signup}>
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}