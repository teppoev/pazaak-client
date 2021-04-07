import {Spinner} from "react-bootstrap";
import React from "react";
import s from "./Loading.module.css"

export default function Loading({t = "", size}) {
    function renderCore() {
        return (
            <span className={`${s.Loading}`}>
                <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size={size}
                    style={{marginRight: 20 + 'px'}}/>
                {t.Loading}
            </span>
        )
    }

    return (
        <span>
        {size !== "sm"
            ? <h3>{renderCore()}</h3>
            : <span>{renderCore()}</span>
        }
        </span>
    )
}