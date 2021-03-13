import LoaderButton from "../../../LoaderButton/LoaderButton";
import React, {useState} from "react";
import s from "../Profile.module.css";
import {changeDeck} from "../../../../../AWS_API";

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val['N'] === b[index]['N']);
}

export default function SaveDeckButton({oldDeck, setOldDeck, myDeck, myCards, t}) {
    const [isLoading, setIsLoading] = useState(false)
    async function handleSave() {
        setIsLoading(true)
        await changeDeck(myDeck, myCards)
        setOldDeck(oldDeck => [...myDeck])
        setIsLoading(false)
        alert("Успешно!");
    }

    function areAllDeckCellsFilled() {
        return !myDeck.find(x => x.NULL)
    }

    return  (
        <LoaderButton
            className={`${s.ChangeDeckButton}`}
            variant="outline-primary"
            disabled = {!areAllDeckCellsFilled() || arrayEquals(myDeck, oldDeck)}
            isLoading={isLoading}
            onClick={handleSave}
            t={t.loading}>
            {t.save.Save}
        </LoaderButton>
    )
}