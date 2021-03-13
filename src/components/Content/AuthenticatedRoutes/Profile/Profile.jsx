import React, {useEffect, useState} from "react";
import s from "./Profile.module.css";
import {loadCards, loadProfile} from "../../../../AWS_API";
import CardsTable from "./CardsTable/CardsTable";
import DeckTable from "./DeckTable/DeckTable";
import Loading from "../Loading/Loading";
import SaveDeckButton from "./SaveDeckButton/SaveDeckButton";
import CleanDeckButton from "./CleanDeckButton/CleanDeckButton";
import {Col, Container, Row} from "react-bootstrap";

export default function Profile(props) {
    //some info to WebStorm (JSDoc) to avoid warnings
    /**
     * @param profile.cards
     * @param profile.cards.M
     * @param profile.deck
     * @param profile.deck.L
     */

    const [cards, setCards] = useState([]);
    const [myCards, setMyCards] = useState({});
    const [myDeck, setMyDeck] = useState([]);
    const [oldDeck, setOldDeck] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            try {
                return {cards: await loadCards(), profile: await loadProfile()};
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }
        }

        let isMounted = true;
        onLoad().then(({cards, profile}) => {
            if (isMounted) {
                setCards(cards);
                setMyCards(profile.cards.M);
                setMyDeck(profile.deck.L);
                setOldDeck(profile.deck.L);
                setIsLoading(false);
            }
        });
        return () => {isMounted = false;}
    }, [])

    return (
        <div className={s.profileWrapper}>
            {isLoading ? <Loading t={props.Loading}/> :
                <Container>
                    <Row className={s.profile}>
                        <Col xl={9} lg={9} md={9}>
                            <CardsTable myCards={myCards} myDeck={myDeck} cards={cards} setMyCards={setMyCards}
                                        setMyDeck={setMyDeck}/>
                        </Col>
                        <Col xl={3} lg={3} md={3}>
                            <DeckTable myCards={myCards} myDeck={myDeck} cards={cards} setMyCards={setMyCards}
                                       setMyDeck={setMyDeck}/>
                        </Col>
                    </Row>
                    <Row>
                        <SaveDeckButton oldDeck={oldDeck} setOldDeck={setOldDeck} myDeck={myDeck} myCards={myCards}
                                        t={{save: props.t.SaveDeckButton, loading: props.Loading}}/>
                                            <CleanDeckButton t={props.t.CleanDeckButton} myCards={myCards} myDeck={myDeck} cards={cards}
                                            setMyCards={setMyCards} setMyDeck={setMyDeck}/>
                                            </Row>
                                            </Container>
                                            }
                                            </div>
                                            );
                                        }