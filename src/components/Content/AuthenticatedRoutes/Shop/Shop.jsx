import React, {useEffect, useReducer, useRef, useState} from "react";
import s from "./Shop.module.css";
import {Col, Container, Row, Table} from "react-bootstrap";
import CardPanel from "./Card/CardPanel";
import Loading from "../Loading/Loading";
import {loadCards, loadProfile} from "../../../../AWS_API";
import Card from "../Card/Card";

export default function Shop(props) {
    function cardReducer(state, action) {
        switch (action.type) {
            case "SET_CARD": {
                return {
                    card: action.card,
                    cardNumber: action.myCards[action.card.card_id.N] ? action.myCards[action.card.card_id.N].N : "0"
                };
            }
            case "SET_CARD_NUMBER": {
                return {
                    ...state,
                    cardNumber: action.myCards[state.card.card_id.N] ? action.myCards[state.card.card_id.N].N : "0"
                }
            }
            default:
                throw new Error();
        }
    }

    const initialState = {
        card: {},
        cardNumber: "0"
    }

    function init(initialState) {
        return {
            card: initialState.card,
            cardNumber: initialState.cardNumber
        };
    }

    const [cardState, cardDispatch] = useReducer(cardReducer, initialState, init);

    const [credits, setCredits] = useState("");
    const [cards, setCards] = useState([]);
    const [myCards, setMyCards] = useState({});
    const [isLoadingShopFeed, setIsLoadingShopFeed] = useState(true);
    const [isLoadingCardPanel, setIsLoadingCardPanel] = useState(true);
    const [activeButton, setActiveButton] = useState("");

    const isInitialMount = useRef(true);

    /**
     * @param e.balance
     */

    function fillInfoAfterFetching(profile, cardDispatchType, card = {}) {
        setCredits(profile.balance.N);
        const _myCards = Object.assign({}, profile.cards.M);
        (profile.deck.L).forEach(x => {
            _myCards[x.N] = _myCards[x.N] != null ? {"N": parseInt(_myCards[x.N].N) + 1} : {"N": 1}
        })
        setMyCards(_myCards);
        if (cardDispatchType === "SET_CARD") {
            cardDispatch({type: "SET_CARD", myCards: _myCards, card: card});
        } else if (cardDispatchType === "SET_CARD_NUMBER") {
            cardDispatch({type: "SET_CARD_NUMBER", myCards: _myCards});
        } else throw new Error("Unknown card dispatch type in shop");
        setIsLoadingCardPanel(false);
    }

    useEffect(() => {
        async function getCardsAndProfile() {
            let cards, profile;
            try {
                cards = await loadCards();
                if (isMounted) {
                    setCards(cards);
                    setIsLoadingShopFeed(false);
                }
                profile = await loadProfile();
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }
            return {cards, profile};
        }
        async function getProfile() {
            try {
                return await loadProfile();
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }
        }

        let isMounted = true
        setIsLoadingCardPanel(true)

        if (isInitialMount.current) {
            setIsLoadingShopFeed(true)
            getCardsAndProfile().then(({cards, profile}) => {
                if (isMounted) {
                    try {
                        fillInfoAfterFetching(profile, "SET_CARD", cards[0])
                    } catch (e) {
                        console.log(e.message);
                        alert(e.message);
                    }
                }
            })
            isInitialMount.current = false;
        } else {
            getProfile().then(profile => {
                if (isMounted) {
                    try {
                        fillInfoAfterFetching(profile, "SET_CARD_NUMBER")
                    } catch (e) {
                        console.log(e.message);
                        alert(e.message);
                    }
                }
            });
        }
        return (() => {
            isMounted = false;
        })
    }, [credits]);

    function renderCards(cards, myCards) {
        return cards.map(card => (
            <tr
                key={card.card_id.N}
                className={card.card_id.N === activeButton ? "table-active" : "table-default"}
                onClick={() => {
                    cardDispatch({type: "SET_CARD", card: card, myCards: myCards});
                    setActiveButton(card.card_id.N);
                }}>
                <td className={`${s.CardIcon}`}>
                    <Card cardType={card.card_type.S} cardName={card.card_name.S}/>
                </td>
                <td className="align-middle">{`Карта для игры в пазаак ${card.card_name.S}`}</td>
            </tr>
        ));
    }

    return (
        <div className={`${s.Shop}`}>
            {isLoadingShopFeed ? <Loading t={props.Loading}/> :
                <Container>
                    <Row>
                        <Col>
                            <div className="text-right" style={{whiteSpaces: "pre"}}>
                                Кредитов: {isLoadingCardPanel ? <Loading size="sm"/> : credits}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <Table hover className={`table table-bordered ${s.ShopTable}`}>
                                <tbody>
                                {renderCards(cards, myCards)}
                                </tbody>
                            </Table>
                        </Col>
                        <Col lg={6}>
                            <CardPanel
                                card={cardState.card}
                                cardNumber={cardState.cardNumber}
                                credits={credits}
                                setCredits={setCredits}
                                setMyCards={setMyCards}
                                isLoadingCardPanel={isLoadingCardPanel}
                                Loading={props.Loading}
                            />
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
}