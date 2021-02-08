import LoaderButton from "../../../LoaderButton/LoaderButton";
import React, {useState} from "react";
import s from "../Profile.module.css";
import {changeDeck} from "../../../../../AWS_API";

export default function SaveDeckButton({myDeck, myCards, t}) {
    const [isLoading, setIsLoading] = useState(false)
    async function handleSave() {
        setIsLoading(true)
        await changeDeck(myDeck, myCards)
        setIsLoading(false)
    }

    function areAllDeckCellsFilled() {
        return myDeck.find(x => x.NULL)
    }

    return  (
        <LoaderButton
            className={`${s.ChangeDeckButton}`}
            variant="outline-primary"
            disabled = {areAllDeckCellsFilled()}
            isLoading={isLoading}
            onClick={handleSave}
            t={t.loading}>
            {t.save.Save}
        </LoaderButton>
    )
}