import React from "react";
import s from "./Request.module.css"
import {Button, Col, Row} from "react-bootstrap";
import {throwChallenge, cancelChallenge, denyChallenge, acceptChallenge} from "../../../../../../AWS_API";

export default function Request({
                                    opponent,
                                    account,
                                    isIncoming,
                                    isRequestOutNotEmpty,
                                    setRequestOut,
                                    setRequestsIn,
                                    initialRequestOutState,
                                    removeFromRequestsIn
                                }) {
    /**
     * @param e.max_wager
     */
    const maxWager = Math.min(account.max_wager, account.balance.N)
    const [wasChanged, setWasChanged] = React.useState(opponent.wasChanged);
    const [wager, setWager] = React.useState(opponent.wager === 0 ? maxWager : opponent.wager)
    const [wasSent, setWasSent] = React.useState(false)
    const [isChangingWager, setIsChangingWager] = React.useState(wasChanged)
    const [changingWager, setChangingWager] = React.useState(wager)

    async function handleThrow() {
        try {
            await throwChallenge(opponent.username, wager, wasChanged);
        } catch (e) {
            console.log(e.message)
        }
    }

    async function handleCancel() {
        try {
            await cancelChallenge(opponent.username);
        } catch (e) {
            console.log(e.message)
        }
    }

    async function handleDeny() {
        try {
            await denyChallenge(opponent.username);
        } catch (e) {
            console.log(e.message)
        }
    }

    async function handleAccept() {
        try {
            await acceptChallenge(opponent.username, wager);
        } catch (e) {
            console.log(e.message)
        }
    }

    function handleOnWagerChange(event, minDisplayableValue) {
        let value = parseInt(event.target.value)
        if (isNaN(value)) value = minDisplayableValue;
        if (value > maxWager) value = maxWager;
        setChangingWager(value)
    }

    function isNotEnoughMoney() {
        return maxWager < wager;
    }

    function isNoCredits() {
        return maxWager === 0;
    }

    return (
        <div className={`${isIncoming ? s.incomingRequest : s.outcomingRequest} ${s.request}`}>
            <Row>
                <Col className={s.categoryOfRequest}>
                    <h6>{isIncoming ? `Входящий запрос` : `Исходящий запрос`}</h6>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>
                        Соперник:<br/>
                        {`${opponent.username}`}
                    </p>
                    <p>{`Рейтинг: ${opponent.rating}`}</p>
                    <div>
                        <span className={s.wagerLabel}>{`Ставка: `}</span>
                        <input type="numbers" className={s.wagerTextInput} min={1}
                               value={changingWager}
                               onChange={event => handleOnWagerChange(event, 0)} disabled={!isChangingWager}/>
                        {isChangingWager &&
                        <input type="range" className={s.wagerRangeInput}
                               min={1} max={maxWager} step={1} value={changingWager}
                               onChange={event => handleOnWagerChange(event, 1)}/>}
                    </div>
                </Col>
                {isIncoming ?
                    <Col className={s.incomingRequestButtons}>
                        <Button variant="outline-success" block onClick={() => {
                            handleAccept().then(() => {
                            })
                        }} disabled={isNotEnoughMoney() || isNoCredits()}>
                            Принять
                        </Button>
                        <Button variant="outline-secondary" block onClick={() => {
                            setRequestOut({
                                username: opponent.username,
                                rating: opponent.rating,
                                wasChanged: true,
                                wager: opponent.wager
                            })
                            setRequestsIn(oldList => oldList.filter(i => i.username !== opponent.username))
                        }} disabled={isRequestOutNotEmpty() || isNoCredits()}>
                            Изменить ставку
                        </Button>
                        <Button variant="danger" block onClick={() => {
                            handleDeny().then(() => {
                                removeFromRequestsIn(opponent.username)
                            })
                        }}>
                            Отклонить
                        </Button>
                    </Col> :
                    <Col className={s.outcomingRequestButtons}>
                        <Button variant="outline-success" block onClick={() => {
                            handleThrow().then(() => {
                                setWasSent(true)
                                if (wasChanged) setWasChanged(false);
                            })
                        }} disabled={wasSent || isChangingWager || isNoCredits()}>
                            Предложить
                        </Button>
                        {isChangingWager ?
                            <div>
                                <Button variant="success" block onClick={() => {
                                    setWager(changingWager)
                                    setIsChangingWager(false)
                                }} disabled={changingWager === 0}>
                                    Сохранить
                                </Button>
                                <Button variant="danger" block onClick={() => {
                                    setChangingWager(wager)
                                    setIsChangingWager(false)
                                }}>
                                    Отменить
                                </Button>
                            </div> :
                            <div>
                                <Button variant="outline-secondary" block onClick={() => {
                                    setIsChangingWager(true)
                                }} disabled={wasSent || isNoCredits()}>
                                    Изменить ставку
                                </Button>
                                <Button variant="danger" block onClick={() => {
                                    if (!wasChanged) {
                                        if (!wasSent) {
                                            setRequestOut(initialRequestOutState)
                                        } else {
                                            handleCancel().then(() => {
                                                setRequestOut(initialRequestOutState)
                                            })
                                        }
                                    } else {
                                        handleDeny().then(() => {
                                            setRequestOut(initialRequestOutState)
                                        })
                                    }
                                }}>
                                    Отменить
                                </Button>
                            </div>
                        }
                    </Col>
                }
            </Row>
        </div>
    )
}