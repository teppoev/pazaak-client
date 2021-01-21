import React, {useEffect, useState} from "react";
import s from "./Profile.module.css";
import {API} from "aws-amplify";
import {Card, Image, Spinner, Table} from "react-bootstrap";
import LoaderButton from "../../LoaderButton/LoaderButton";

export default function Profile(props) {
    const [cards, setCards] = useState([]);
    const [myCards, setMyCards] = useState({});
    const [myDeck, setMyDeck] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const badTexture = "https://psv4.userapi.com/c856528/u81794582/docs/d12/a0437f0acd92/cut.jpg?extra=4h3easXssSqsJ7L9UGD9v-lt_pTv4nlGgmFOcChYfoIgYpGfkrQgPO44krANfGq-xG3mI1zRcaX5do8Kb8qNlGUgfve22WKCwVgzhFJtczvW0SWhBNyVNAkUHzwejXqEeU0-tv4LTodlrC6J58ei";

    useEffect(() => {
        async function onLoad() {

            try {
                const cards = await loadCards();
                const profile = await loadProfile();
                setCards(cards);
                setMyCards(profile.cards.M);
                setMyDeck(profile.deck.L);
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [])

    async function loadCards() {
        return API.get("pazaak-rest", "/cards");
    }

    async function loadProfile() {
        return API.get("pazaak-rest", "/account/info");
    }

    function renderCard() {
        let rows = [];
        cards.sort((a, b) => (parseInt(a.card_id.N) < parseInt(b.card_id.N) ? -1 : 1)).map((card, i) => {
            if (i % 6 === 0) rows.push([]);
            rows[parseInt(i / 6)].push(card);
            return card;
        });
        return rows.map((row) => (
            <tr key={row[0].card_id.N}>
                {
                    row.map((card) => (
                        <td key={card.card_id.N} className={`${s.CardIcon}`}>
                            <Card className={`${s.CardsCard} text-white`}>
                                <Card.Img src={card.texture ? card.texture.S : badTexture} />
                                <Card.ImgOverlay>
                                    <Card.Title>
                                        {myCards[card.card_id.N] ? myCards[card.card_id.N].N : "0"}
                                    </Card.Title>
                                </Card.ImgOverlay>
                            </Card>
                        </td>
                    ))
                }
            </tr>
        ));
    }

    function renderDeck() {
        let rows = [];
        myDeck.map((card_id, i) => {
            if (i % 2 === 0) rows.push([]);
            rows[parseInt(i / 2)].push(cards.find((element, index, array) => (element.card_id.N === card_id.N)));
            return card_id;
        });
        return rows.map((row, i) => (
            <tr key={i * 10}>
                {
                    row.map((card, j) => (
                        <td key={i * 2 + j} className={`${s.CardIcon}`}>
                            <Image fluid src={card.texture ? card.texture.S : badTexture}/>
                        </td>
                    ))
                }
            </tr>
        ));
    }

    function handleClean() {

    }

    function handleSave() {

    }

    return (
        <div className={s.Profile}>
            {
                isLoading ?
                    <h3>
                        <Spinner
                            as="span"
                            animation="border"
                            role="status"
                            aria-hidden="true"
                            style={{marginRight: 20 + 'px'}}
                        />
                        Загрузка...
                    </h3> :
                    <div>
                        <div className="row">
                            <div className="col-lg-9 col-md-9">
                                <Table bordered className={`${s.CardsTable}`}>
                                    <tbody>
                                    {renderCard()}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col-lg-3 col-md-3">
                                <Table bordered className={`${s.DeckTable}`}>
                                    <tbody>
                                    {renderDeck()}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <LoaderButton
                            variant="outline-primary"
                            className={`${s.ChangeDeckButton}`}
                            isLoading={isLoading}
                            onClick={handleSave}>
                            Сохранить
                        </LoaderButton>
                        <LoaderButton
                            variant="outline-secondary"
                            className={`${s.ChangeDeckButton}`}
                            isLoading={isLoading}
                            onClick={handleClean}>
                            Очистить
                        </LoaderButton>
                    </div>
            }
        </div>
    );
}