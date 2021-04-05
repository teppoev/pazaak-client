import React from "react";
import s from "./Rules.module.css"

export default function Rules(props) {
    return (
        <div className={s.Rules}>
            {props.t.Rules}
        </div>
    );
}