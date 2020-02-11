import React from "react";
import { Button } from "react-bootstrap";
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
            {isLoading && <>Wait...</>}
            {!isLoading && props.children}
        </Button>
    );
}