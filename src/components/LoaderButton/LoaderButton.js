import React from "react";
import {Button, Spinner} from "react-bootstrap";
import s from "./LoaderButton.module.css";

export default function LoaderButton({
                                         isLoading,
                                         className = "",
                                         disabled = false,
                                         ...props
                                     }) {
    return (
        <Button
            className={`${s.LoaderButton} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <>
                <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                    style={{marginRight: 20 + 'px'}}
                />
                Загрузка...
            </> : <></>}
            {!isLoading && props.children}
        </Button>
    );
}