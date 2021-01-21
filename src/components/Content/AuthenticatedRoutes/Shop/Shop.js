/*
import React, {useEffect, useState} from "react";
import s from "./Shop.module.css";
import {API} from "aws-amplify";
import {Image, Spinner, Table} from "react-bootstrap";
import Card from "./Card/Card";

export default function Shop(props) {
    const [credits, setCredits] = useState("");
    const [cards, setCards] = useState([]);
    const [myCards, setMyCards] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [card, setCard] = useState({});
    const [cardNumber, setCardNumber] = useState("0");
    const [activeButton, setActiveButton] = useState("");

    const badTexture = "%PUBLIC_URL%/../../cards_logos/bad-texture.jpg";

    useEffect(() => {
        async function onLoad() {

            try {
                const cards = await loadCards();
                const profile = await loadProfile();
                setCards(cards);
                setCredits(profile.balance.N);
                setMyCards(profile.cards.M);
                setCard(cards[0]);
                setCardNumber(profile.cards.M[cards[0].card_id.N] ? profile.cards.M[cards[0].card_id.N].N : "0");
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }

            setIsLoading(false);
        }

        onLoad();
    }, []);

    async function loadCards() {
        return API.get("pazaak-rest", "/cards");
    }

    async function loadProfile() {
        return API.get("pazaak-rest", "/account/info");
    }

    function renderCards(cards, myCards) {
        return cards.map(card => (
            <tr
                key={card.card_id.N}
                className={card.card_id.N === activeButton ? "table-active" : "table-default"}
                onClick={() => {
                    setCard(card);
                    setCardNumber(myCards[card.card_id.N] ? myCards[card.card_id.N].N : "0");
                    setActiveButton(card.card_id.N);
            }}>
                <td className={`${s.CardIcon}`}><Image src={card.texture ? card.texture.S : badTexture} height="100px"/></td>
                <td className="align-middle">{`Карта для игры в пазаак ${card.card_name.S}`}</td>
            </tr>
        ));
    }

    return (
        <div className={`${s.Shop}`}>
            <div className="text-right" style={{whiteSpaces: "pre"}}>
                Кредитов: {isLoading ?
                <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    size="sm"
                /> :
                credits
            }
            </div>
            {isLoading ?
                <h3 className={s.Top}>
                    <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        aria-hidden="true"
                        style={{marginRight: 20 + 'px'}}
                    />
                    Загрузка списка товаров...
                </h3> :
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <Table hover className={`table table-bordered ${s.ShopTable}`}>
                            <tbody>
                            {renderCards(cards, myCards)}
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <Card
                            card={card}
                            cardNumber={cardNumber}
                            credits={credits}
                            setCredits={setCredits}
                            setMyCards={setMyCards}
                            setCardNumber={setCardNumber}
                        />
                    </div>
                </div>
            }
        </div>
    );
}*/
