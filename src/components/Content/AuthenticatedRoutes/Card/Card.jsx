import React from "react";
import s from "./Card.module.css";
import CardColors from "./CardColors/CardColors";
import CardByType from "./CardByType/CardByType";

export default function Card({cardType, cardName, count, isEmpty, onClick}) {
    const validCardTypes = [
        "empty",
        "simple",
        "positive",
        "negative",
        "changeable", "reverse-changeable",
        "special", "reverse-special",
        "champion", "reverse-changeable"
    ]

    return (
        <div>
            <svg className={s.defs}>
                <CardColors/>
                <CardByType cardName={cardName} cardType={cardType}/>
            </svg>
            <div className={s.scalingSvgContainer}>
                <svg viewBox="0 0 100 144" onClick={onClick} key={count}>
                    {
                        !isEmpty
                            ? <g>
                                <use
                                    xlinkHref={validCardTypes.indexOf(cardType) !== -1 ?
                                        `#svg-card-${cardType}-${cardName}` :
                                        `#svg-card-unrecognized-type-${cardName}`}/>
                                {count != null && <text className={s.count} x="90%" y="95%">{count}</text>}
                            </g>
                            : <g>
                                <rect width="100%" height="100%" fill="none" stroke="black"/>
                            </g>
                    }
                </svg>
            </div>
        </div>
    )
}
