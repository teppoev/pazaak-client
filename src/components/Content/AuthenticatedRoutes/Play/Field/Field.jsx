import React, {useCallback} from "react"
import {Button, Col, Container, Row} from "react-bootstrap";
import {giveUpMatch, getMatchInfo, getCards, makeMove} from "../../../../../AWS_API";
import Loading from "../../Loading/Loading";
import Card from "../../Card/Card";
import s from "./Field.module.css"

// There can be only four possible states:
// 1 — the player should move, they can use hand
// 2 — the player should move, they can't use hand (because already used just now)
// 3 — the player is waiting for their opponent to move
// 4 — the player stood and is now waiting for their opponent to finish the round

// There are seven possible actions to player in each turn:
// -3 — to surrender
// -2 — to stand
// -1 — to finish turn
// 0-3 — to use card 0-3 from player's hand

export default function Field({ws, setCurrentMatchID}) {
    const [wager, setWager] = React.useState(-1)
    const [myField, setMyField] = React.useState([])
    const [myFieldDeltas, setMyFieldDeltas] = React.useState([])
    const [myHand, setMyHand] = React.useState([])
    const [myUsername, setMyUsername] = React.useState("")
    const [myState, setMyState] = React.useState("")
    const [roundsWonByMe, setRoundsWonByMe] = React.useState(-1)
    const [myScore, setMyScore] = React.useState(-1)
    const [opField, setOpField] = React.useState([])
    const [opHand, setOpHand] = React.useState([])
    const [opUsername, setOpUsername] = React.useState("")
    const [opFieldDeltas, setOpFieldDeltas] = React.useState([])
    const [roundsWonByOp, setRoundsWonByOp] = React.useState(-1)
    const [opScore, setOpScore] = React.useState(-1)
    const [cards, setCards] = React.useState([])

    // 0 - nobody, 1 - player, 2 - opponent, 3 - both (== nobody)
    const [winnerInCaseOfTie, setWinnerInCaseOfTie] = React.useState(0)

    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function onLoad() {
            try {
                return {
                    matchInfo: await getMatchInfo(),
                    cards: await getCards("match")
                };
            } catch (e) {
                console.log(e.message);
                alert(e.message);
            }
        }

        function setNewField(field) {
            let newField = []
            for (let cardID of field) {
                newField.push(cardID)
            }
            if (newField.length > 9) {
                throw new Error("Field contains more than 9 cards!")
            } else if (newField.length < 9) {
                let len = newField.length
                while (len < 9) {
                    newField.push({
                        'N': '0'
                    })
                    ++len
                }
            }
            return newField
        }

        onLoad().then(({matchInfo, cards}) => {
            setCards(cards)
            setWager(parseInt(matchInfo.wager))
            setMyField(() => setNewField(matchInfo.me.field.L))
            setMyHand(matchInfo.me.hand.L)
            setMyUsername(matchInfo.me.username.S)
            setMyState(matchInfo.me.state.N)
            setRoundsWonByMe(parseInt(matchInfo.me.rounds_won.N))
            setOpField(() => setNewField(matchInfo.opponent.field.L))
            setOpHand(matchInfo.opponent.hand.L)
            setOpUsername(matchInfo.opponent.username.S)
            setRoundsWonByOp(parseInt(matchInfo.opponent.rounds_won.N))
            setWinnerInCaseOfTie(() => {
                let myIndex = matchInfo.me.field.L.indexOf(x => {
                    let cardID = x.N;
                    if (cardID === "501" || cardID === "701") return true;
                })
                let opIndex = matchInfo.opponent.field.L.indexOf(x => {
                    let cardID = x.N;
                    if (cardID === "501" || cardID === "701") return true;
                })
                if (myIndex === -1) {
                    if (opIndex === -1) return 0;
                    return 2;
                } else {
                    if (opIndex === -1) return 1;
                    return 3;
                }
            })
            setIsLoading(false);

            ws.onmessage = evt => {
                // listen to data sent from the websocket server
                const message = JSON.parse(evt.data)
                switch (message.action) {
                    case "finish match": {
                        setCurrentMatchID({NULL: true})
                        break;
                    }
                    default: {
                        console.log(`Got unknown action: ${message.action}!`)
                    }
                }
            }
        });
    }, [ws, setCurrentMatchID])

    const countScore = useCallback((field) => {
        let deltas = []
        let sum = 0
        let sumOfTwosAndFours = 0;
        let sumOfThreesAndSixes = 0;
        for (let i = 0; i < field.length; ++i) {
            let card = cards.find(el => {
                return el.card_id.N === field[i]
            })
            let cardID = parseInt(field[i])
            if (cardID / 100 !== 4 && cardID / 100 !== 5) {
                if (cardID % 100 === 2 || cardID % 100 === 4) {
                    sumOfTwosAndFours += cardID % 100;
                }
                if (cardID % 100 === 3 || cardID % 100 === 6) {
                    sumOfThreesAndSixes += cardID % 100;
                }
            }
            switch (card.card_type.S) {
                case "simple": {
                    deltas.push(cardID)
                    break
                }
                case "positive": {
                    deltas.push(cardID - 100)
                    break
                }
                case "negative": {
                    deltas.push(-cardID + 200)
                    break
                }
                case "changeable": {
                    deltas.push(cardID - 300)
                    break
                }
                case "reverse-changeable": {
                    deltas.push(-cardID + 600)
                    break
                }
                case "special": {
                    switch (cardID) {
                        case 401: {
                            deltas.push(sum)
                            break
                        }
                        case 402: {
                            deltas.push(-2 * sumOfTwosAndFours)
                            break
                        }
                        case 403: {
                            deltas.push(-2 * sumOfThreesAndSixes)
                            break
                        }
                        case 404: {
                            deltas.push(1)
                            break
                        }
                        default: {
                            throw new Error(`There is no card in type "${card.card_type.S}" with id=${cardID}!`)
                        }
                    }
                    break
                }
                case "reverse-special": {
                    switch (cardID) {
                        case 701: {
                            deltas.push(-1)
                            break
                        }
                        case 702: {
                            deltas.push(2)
                            break
                        }
                        case 703: {
                            deltas.push(-2)
                            break
                        }
                        default: {
                            throw new Error(`There is no card in type "${card.card_type.S}" with id=${cardID}!`)
                        }
                    }
                    break
                }
                case "champion": {
                    switch (cardID) {
                        case 501: {
                            deltas.push(1)
                            break
                        }
                        default: {
                            throw new Error(`There is no card in type "${card.card_type.S}" with id=${cardID}!`)
                        }
                    }
                    break
                }
                case "reverse-champion": {
                    switch (cardID) {
                        case 801: {
                            deltas.push(-1)
                            break
                        }
                        default: {
                            throw new Error(`There is no card in type "${card.card_type.S}" with id=${cardID}!`)
                        }
                    }
                    break
                }
                case "empty": {
                    deltas.push(0)
                    break
                }
                default: {
                    throw new Error(`There is no card with type "${card.card_type.S}"!`)
                }
            }
            sum += deltas[i]
        }
        return deltas
    }, [cards])

    function sum(arr) {
        let _sum = 0
        for (let item of arr) {
            _sum += item
        }
        return _sum
    }

    React.useEffect(() => {
        setMyFieldDeltas(() => countScore(myField.map(x => x.N)))
    }, [myField, countScore])

    React.useEffect(() => {
        setOpFieldDeltas(() => countScore(opField.map(x => x.N)))
    }, [opField, countScore])

    React.useEffect(() => {
        setMyScore(() => sum(myFieldDeltas))
    }, [myFieldDeltas])

    React.useEffect(() => {
        setOpScore(() => {
            setOpScore(() => sum(opFieldDeltas))
        })
    }, [opFieldDeltas])

    function cardTypeByID(id) {
        if (id.N === "-1") return "unopened"
        let card = cards.find(x => x.card_id.N === id.N)
        return card.card_type.S
    }

    function cardTextByID(id) {
        if (id.N === "-1") return ""
        let card = cards.find(x => x.card_id.N === id.N)
        switch (card.card_type.S) {
            case "positive":
            case "negative":
                return card.card_name.S
            case "changeable":
                return `+${card.card_name.S.substring(1)}`
            case "reverse-changeable":
                return `-${card.card_name.S.substring(1)}`
            case "special":
            case "reverse-special":
                switch (id.N) {
                    case "401":
                    case "402":
                    case "403":
                        return card.card_name.S
                    case "404":
                        return "+1"
                    case "701":
                        return "-1"
                    case "702":
                        return "+2"
                    case "703":
                        return "-2"
                    default:
                        throw new Error(`Unexpected card_id=${id.N} for type "special"`)
                }
            case "champion":
            case "reverse-champion":
                switch (id.N) {
                    case "501":
                        return "+1T"
                    case "801":
                        return "-1T"
                    default:
                        throw new Error(`Unexpected card_id=${id.N} for type "champion"`)
                }
            case "empty":
                return ""
            default:
                throw new Error(`Unexpected card_type=${card.card_type.S}`)
        }
    }

    function renderField(field, deltas) {
        let divs = [];
        let length = 3;
        for (let i = 0; i < length; i++) {
            divs.push([]);
        }

        field.map((cardID, i) => {
            divs[Math.floor(i / length)].push({
                cardType: cardTypeByID(cardID),
                cardName: i < deltas.length ? deltas[i] : ""
            })
            return cardID;
        });

        return divs.map((row, i) => (
            <Row key={`cards-row-${i}`} className={s.fieldRow}>
                {
                    row.map((card, j) => {
                        return (
                            <Col key={`card-${i}-${j}`} className={s.fieldCell}>
                                <Card cardType={card.cardType} cardName={card.cardName}/>
                            </Col>
                        )
                    })
                }
            </Row>
        ));
    }

    function handleChangeSign(i, cardType, cardID) {
        setMyHand((oldHand) => {
            let newHand = []
            for (let j = 0; j < i; ++j) newHand.push(oldHand[j])
            let newCardID = 0
            switch (cardType) {
                case "changeable": {
                    newCardID = {N: (parseInt(cardID) + 300).toString()}
                    break
                }
                case "reverse-changeable": {
                    newCardID = {N: (parseInt(cardID) - 300).toString()}
                    break
                }
                case "champion": {
                    newCardID = {N: "801"}
                    break
                }
                case "reverse-champion": {
                    newCardID = {N: "501"}
                    break
                }
                case "special": {
                    newCardID = {N: "701"}
                    break
                }
                case "reverse-special": {
                    switch (cardID) {
                        case "701": {
                            newCardID = {N: "401"}
                            break
                        }
                        case "702": {
                            newCardID = {N: "703"}
                            break
                        }
                        case "703": {
                            newCardID = {N: "702"}
                            break
                        }
                        default: {
                            throw new Error(`unknown reverse cardID: ${cardID}`)
                        }
                    }
                    break
                }
                default: {
                    throw new Error(`unknown reverse cardType: ${cardType}`)
                }
            }
            newHand.push(newCardID)
            for (let j = i + 1; j < oldHand.length; ++j) {
                newHand.push(oldHand[j])
            }
            return newHand
        })
    }

    function handleChangeValue(i, cardType, cardID) {
        setMyHand((oldHand) => {
            let newHand = []
            for (let j = 0; j < i; ++j) newHand.push(oldHand[j])
            let newCardID = 0
            switch (cardType) {
                case "special": {
                    newCardID = {N: "702"}
                    break
                }
                case "reverse-special": {
                    switch (cardID) {
                        case "701": {
                            newCardID = {N: "703"}
                            break
                        }
                        case "702": {
                            newCardID = {N: "404"}
                            break
                        }
                        case "703": {
                            newCardID = {N: "701"}
                            break
                        }
                        default: {
                            throw new Error(`unknown reverse cardID: ${cardID}`)
                        }
                    }
                    break
                }
                default: {
                    throw new Error(`unknown reverse cardType: ${cardType}`)
                }
            }
            newHand.push(newCardID)
            for (let j = i + 1; j < oldHand.length; ++j) {
                newHand.push(oldHand[j])
            }
            return newHand
        })
    }

    function lenOfField(field) {
        let counter = 0
        for (let cardID of field) {
            if (cardID.N !== "0") ++counter
        }
        return counter
    }

    function renderHand(hand, isPlayer = false) {
        return hand.map((card, i) => {
            let cardType = cardTypeByID(card)
            let cardText = cardTextByID(card)
            return (
                <Col key={`hand-card-${i}`} className={s.handCellWrapper}>
                    <div id={`hand-card-${i}`}
                         draggable={isPlayer && myState === "1" && cardType !== "empty" && lenOfField(myField) < 9}
                         onDragStart={e => {
                             e.dataTransfer.setData('positionInHand', i)
                         }} onDragOver={e => {
                        e.stopPropagation()
                    }}>
                        <Card cardType={cardType} cardName={cardText}/>
                    </div>
                    {(cardType === "changeable" || cardType === "reverse-changeable" ||
                        cardType === "reverse-special" || cardType === "reverse-champion" ||
                        card.N === "404" || card.N === "501") && isPlayer &&
                    <Button className={s.changeCardButton} block variant="outline-secondary"
                            onClick={() => {
                                handleChangeSign(i, cardType, card.N)
                            }}>
                        {`Поменять знак`}
                    </Button>}
                    {(cardType === "reverse-special" || card.N === "404") && isPlayer &&
                    <Button className={s.changeCardButton} block variant="outline-secondary"
                            onClick={() => {
                                handleChangeValue()
                            }}>
                        {`Поменять значение`}
                    </Button>}
                </Col>
            )
        })
    }

    function usingCardFromHand(e) {
        e.preventDefault()
        const idx = e.dataTransfer.getData('positionInHand')

        if (myState === "1" && idx !== "" && myHand[idx].N !== "0") {
            let cardToField = myHand[idx]
            setMyHand((oldHand) => {
                let newHand = []
                for (let j = 0; j < oldHand.length; ++j) {
                    newHand.push(oldHand[j])
                }
                newHand[idx] = {N: "0"}
                return newHand
            })
            setMyField((oldField) => {
                let len = lenOfField(oldField)
                let newField = [...oldField]
                newField[len] = cardToField
                return newField;
            })
            setMyState("2")
            makeMove(idx)
        }
    }

    function renderPlayerHalf() {
        return (
            <Col sm={6} className={`${s.half}`}>
                <div className={s.field} id={`my_field`} onDrop={e => {usingCardFromHand(e)}} onDragOver={e => {
                    e.preventDefault()
                }}>
                    {renderField(myField, myFieldDeltas)}
                </div>
                <Row className={s.hand}>
                    {renderHand(myHand, true)}
                </Row>
            </Col>
        )
    }

    function renderOpponentHalf() {
        return (
            <Col sm={6} className={`${s.half}`}>
                <div className={s.field}>
                    {renderField(opField, opFieldDeltas)}
                </div>
                <Row className={s.hand}>
                    {renderHand(opHand, false)}
                </Row>
                <Row>
                    <Col className={s.button}>
                        <Button block variant="outline-success" disabled={myState !== "1" && myState !== "2"}
                                onClick={() => {
                                    console.log(myField)
                                }}>
                            {`Завершить ход`}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className={s.button}>
                        <Button block variant="secondary" onClick={() => {
                            giveUpMatch().then(() => {
                                setCurrentMatchID({NULL: true})
                            })
                        }} disabled={myState !== "1" && myState !== "2"}>{`Пас`}</Button>
                    </Col>
                    <Col className={s.button}>
                        <Button block variant="danger" onClick={() => {
                            giveUpMatch().then(() => {
                                setCurrentMatchID({NULL: true})
                            })
                        }}>{`Сдаться`}</Button>
                    </Col>
                </Row>
            </Col>
        )
    }

    return (
        <div>
            {isLoading ? <Loading size="lg"/> :
                <Container>
                    <Row className={s.upperInfoHeader}>
                        <Col xs={3} lg={4} className={`${s.leftBlock}`}>
                            {myUsername}
                        </Col>
                        <Col xs={1} lg={1} className={`${s.leftCenterBlock}`}>
                            {roundsWonByMe}
                        </Col>
                        <Col xs={4} lg={2} className={`${s.centerBlock}`}>
                            {`Ставка: ${wager}`}
                        </Col>
                        <Col xs={1} lg={1} className={`${s.rightCenterBlock}`}>
                            {roundsWonByOp}
                        </Col>
                        <Col xs={3} lg={4} className={`${s.rightBlock}`}>
                            {opUsername}
                        </Col>
                    </Row>
                    <Row className={s.middleInfoHeader}>
                        <Col xs={3} lg={4} className={`${s.leftBlock}`}>
                            {(winnerInCaseOfTie === 1 || winnerInCaseOfTie === 3) && "WINNER IN TIE"}
                        </Col>
                        <Col xs={1} lg={1} className={`${s.leftCenterBlock}`}>
                            {myScore}
                        </Col>
                        <Col xs={4} lg={2} className={`${s.centerBlock}`}>
                            {myState === "1" || myState === "2" ? `Ваш ход` : `Ход соперника`}
                        </Col>
                        <Col xs={1} lg={1} className={`${s.rightCenterBlock}`}>
                            {opScore}
                        </Col>
                        <Col xs={3} lg={4} className={`${s.rightBlock}`}>
                            {(winnerInCaseOfTie === 2 || winnerInCaseOfTie === 3) && "WINNER IN TIE"}
                        </Col>
                    </Row>
                    <Row className={s.lowerInfoHeader}>
                        <Col>{`До конца хода: ∞`}</Col>
                    </Row>
                    <Row>
                        {renderPlayerHalf()}
                        {renderOpponentHalf()}
                    </Row>
                </Container>
            }
        </div>
    )
}