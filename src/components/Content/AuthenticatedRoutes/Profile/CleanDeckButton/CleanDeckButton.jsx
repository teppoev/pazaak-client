import LoaderButton from "../../../LoaderButton/LoaderButton";
import React from "react";
import s from "../Profile.module.css";

export default function CleanDeckButton({myDeck, cards, myCards, setMyCards, setMyDeck, t}) {
    function handleClean() {
        if (myDeck.findIndex(x => x.N) === -1) return;
        let newMyDeck = myDeck.map(x => x);
        let newMyCards = Object.assign({}, myCards);
        do {
            let myDeckIndex = newMyDeck.findIndex(x => x.N);
            let myCardsIndex = newMyDeck[myDeckIndex].N;
            if (newMyCards[myCardsIndex]) {
                newMyCards[myCardsIndex] = {"N": (parseInt(newMyCards[myCardsIndex].N) + 1).toString()};
            } else {
                newMyCards[myCardsIndex] = {"N": "1"};
            }
            newMyDeck[myDeckIndex] = {"NULL": true};
        }
        while (newMyDeck.findIndex(x => x.N) !== -1);

        setMyCards(newMyCards);
        setMyDeck(newMyDeck);
    }

    return (
        <LoaderButton
            className={`${s.ChangeDeckButton}`}
            variant="outline-secondary"
            onClick={handleClean}>
            {t.Clean}
        </LoaderButton>
    )
}