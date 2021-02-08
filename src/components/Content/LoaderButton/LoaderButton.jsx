import React from "react";
import {Button} from "react-bootstrap";
import s from "./LoaderButton.module.css";
import Loading from "../AuthenticatedRoutes/Loading/Loading";

export default function LoaderButton({
                                         isLoading,
                                         className = "",
                                         disabled = false,
                                         t,
                                         ...props
                                     }) {
    return (
        <Button
            className={`${s.LoaderButton} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Loading t={t} size="sm"/> : props.children}
        </Button>
    );
}