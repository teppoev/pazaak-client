import s from "./CardsTable.module.css";
import React from "react";
import Card from "../../Card/Card";

export default function CardsTable({myCards, cards, myDeck, setMyCards, setMyDeck}) {
    function moveFromCardsToDeck(index) {
        console.log(`${index} was clicked`)
        let deckIndex = myDeck.findIndex(x => x.NULL === true);
        if (deckIndex === -1) return;
        let cardId = cards[index].card_id.N
        if (!myCards[cardId]) return;

        let newMyCards = Object.assign({}, myCards)
        if (parseInt(myCards[cardId].N) > 1) {
            newMyCards[cardId] = {"N": (parseInt(myCards[cardId].N) - 1).toString()};
        } else {
            delete newMyCards[cardId];
        }
        setMyCards(newMyCards)

        let newDeck = myDeck.map(x=>x)
        newDeck[deckIndex] = {"N": cardId};
        setMyDeck(newDeck)
    }

    function renderCards() {
        //some info to WebStorm (JSDoc) to avoid warnings
        /**
         * @param card.card_name
         * @param card.card_name.S
         * @param card.card_type
         * @param card.card_type.S
         */
        let divs = [];
        let length = 6;
        for (let i = 0; i < length; i++) {
            divs.push([]);
        }

        (cards).map((card, i) => {
            divs[i % 6].push(card);
            return card;
        });

        return divs.map((row, i) => (
            <div className={s.cardTableColumns} key={`cards-row-${i}`}>
                {
                    row.map((card, j) => {
                        let count = myCards[card.card_id.N] ? myCards[card.card_id.N].N : 0
                        return (
                            <div key={`cards-row-${i}-element-${6*i+j}`}>
                                {card.card_type.S === "champion"
                                    ? <Card cardName={card.card_name.S} cardType="unopened"/>
                                    : <Card cardName={card.card_name.S} cardType={card.card_type.S}
                                                    count={count} onClick={()=> {moveFromCardsToDeck(6 * j + i)}}/>
                                }
                            </div>
                        )
                    })
                }
            </div>
        ));
    }

    return (
        <div className={s.cardTable}>
            {renderCards()}
        </div>
    )
}