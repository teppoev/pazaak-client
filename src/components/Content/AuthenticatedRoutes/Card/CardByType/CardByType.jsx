import CardConstructor from "../CardConstructor/CardConstructor";
import React from "react";

export default function CardByType({cardType, cardName}) {
    switch (cardType) {
        case "simple": {
            return <CardConstructor cardName={cardName} typePartURL={cardType}/>
        }
        case "positive": {
            return <CardConstructor cardName={cardName} sign={'+'} typePartURL={cardType}/>
        }
        case "negative": {
            return <CardConstructor cardName={cardName} sign={'-'} typePartURL={cardType}/>
        }
        case "changeable": {
            return <CardConstructor cardName={cardName} isChangeable sign={'+'} typePartURL={cardType}/>
        }
        case "reverse-changeable": {
            return <CardConstructor cardName={cardName} isChangeable sign={'-'} typePartURL={cardType}/>
        }
        case "special": {
            return <CardConstructor cardName={cardName} typePartURL={cardType}/>
        }
        case "champion": {
            switch (cardName) {
                case "±1T": {
                    return <CardConstructor cardName={cardName} typePartURL={cardType}/>
                }
                default: {
                    return <CardConstructor cardName={cardName}/>
                }
            }
        }
        case "unopened": {
            return <CardConstructor cardName={cardName} isUnopened/>
        }
        default: {
            return <CardConstructor cardName={cardName}/>
        }
    }
}