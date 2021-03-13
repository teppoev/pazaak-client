import React from "react";
import s from "./CardConstructor.module.css";

export default function CardConstructor({cardName, typePartURL, sign, isChangeable, isUnopened}) {
    const positiveSignColor = "rgb(0,0,60)"
    const negativeSignColor = "rgb(60,0,0)"

    function getURLofChampionCardByName() {
        if (typePartURL !== "champion") {
            return `#svg-card-gradient-${typePartURL}`;
        }
        switch(cardName) {
            case "±1T":
                return `#svg-card-gradient-${typePartURL}-tiebreaker`;
            default:
                return `#svg-card-gradient-${typePartURL}`;
        }
    }

    return (
        <symbol id={`svg-card-${typePartURL}-${cardName}`}>
            {isUnopened
                ? <g>
                    <defs>
                        <symbol id={`svg-card-lock`}>
                            <path d="M 30 57.6
                                     L 30 48.8
                                     A 20 20 0 0 1 70 48.8
                                     L 70 57.6" strokeWidth="5%" fill="none" stroke="black"/>
                            <rect x="20%" y="40%" width="60%" height="40%" fill="none" stroke="black" strokeWidth="5%" rx="15%"/>
                            <circle cx="50%" cy="60%" r="5%" fill="black"/>
                        </symbol>
                    </defs>
                    <rect className={s.cardBodyFill} fill="darkgray"/>
                    <use xlinkHref={`#svg-card-lock`}/>
                </g>
                : <g>
                    {isChangeable
                        ? <g>
                            <rect width="100%" height="50%" x="0%" y="0%"
                                  fill={`url('#svg-card-gradient-${typePartURL}-1')`}/>
                            <rect width="100%" height="50%" x="0%" y="50%"
                                  fill={`url('#svg-card-gradient-${typePartURL}-2')`}/>
                            <rect width="51%" height="26%" x="50%" y="75%"
                                  fill={`url('#svg-card-gradient-${typePartURL}-3')`}/>
                        </g>
                        : <g>
                            <rect className={s.cardBodyFill}
                                  fill={typePartURL ? `url('${getURLofChampionCardByName()}')` : "black"}/>
                        </g>}
                    <rect x="5%" y="3%" width="90%" height="100%" strokeWidth="10%" fill="none" stroke="gray"/>
                    <line x1="0%" y1="75%" x2="100%" y2="75%" strokeWidth="10%" fill="none" stroke="gray"/>
                    <rect x="0%" y="0%" width="50.91" height="50.91" transform="translate(50,18) rotate(45)"
                          fill="gray"/>
                    {sign && <g>
                        <circle cx="90" cy="10" r="10"
                                fill={sign === '+' ? positiveSignColor : negativeSignColor}/>
                        <text className={s.text} x="90" y={sign === '+' ? "11.5" : "10"}>{sign}</text>
                    </g>}
                    <rect x="10%" y="25%" width="80%" height="25%" strokeWidth="2%" fill="black" stroke="gray"/>
                    <text className={s.text} x="50%" y="38%">{typePartURL ? cardName : "ERR"}</text>
                </g>}
        </symbol>
    )
}