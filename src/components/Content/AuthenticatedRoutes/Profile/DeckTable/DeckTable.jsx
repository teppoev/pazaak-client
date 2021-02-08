import s from "./DeckTable.module.css";
import React from "react";
import Card from "../../Card/Card";

export default function DeckTable({myDeck, cards, myCards, setMyCards, setMyDeck}) {
    function moveCardFromDeckToCards(index) {
        if (!myDeck[index].NULL) {
            let i = parseInt(myDeck[index].N);
            let newMyCards = Object.assign({}, myCards);
            if (myCards[i]) {
                newMyCards[i] = {"N": (parseInt(myCards[i].N) + 1).toString()};
            } else {
                newMyCards[i] = {"N": "1"};
            }
            setMyCards(newMyCards);

            let newDeck = myDeck.map(x => x)
            newDeck[index] = {"NULL": true};
            setMyDeck(newDeck);
        }
    }

    function renderDeck() {
        let divs = [[], []];
        myDeck.map((card_id, i) => {
            if (card_id.NULL) {
                divs[i % 2].push(null);
            } else {
                divs[i % 2].push(cards.find((element) => (element.card_id.N === card_id.N)));
            }
            return card_id;
        });

        return divs.map((row, i) => (
            <div className={s.deckTableColumns} key={i}>
                {
                    row.map((card, j) => {
                        if (card) {
                            return (
                                <div className={s.cardWrapper}
                                     key={j} onClick={() => {
                                    moveCardFromDeckToCards(2 * j + i)
                                }}>
                                    <Card cardName={card.card_name.S} cardType={card.card_type.S}/>
                                </div>
                            )
                        } else {
                            return (
                                <div className={s.cardWrapper} key={j}>
                                    <Card isEmpty/>
                                </div>
                            )
                        }
                    })
                }
            </div>
        ));
    }

    /**
     * @param e.card_id
     * @param e.card_id.N
     * @param e.NULL
     */

    return <div className={s.deckTable}>{renderDeck()}</div>
}