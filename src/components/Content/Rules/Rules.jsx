import React from "react";
import s from "./Rules.module.css"

export default function Rules(props) {
    return (
        <div className={s.Rules}>
            <a href="https://starwars.fandom.com/ru/wiki/%D0%9F%D0%B0%D0%B7%D0%B0%D0%B0%D0%BA"
               target="_blank" rel="noopener noreferrer">Страница на Вукипедии</a>
        </div>
    );
}