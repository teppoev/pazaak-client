import React from "react";
import s from "./NotFound.module.css";

export default function NotFound(props) {
    return (
        <div className={s.NotFound}>
            <h3>{props.t.NotFound}</h3>
        </div>
    );
}