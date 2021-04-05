import React from "react";
import s from "./Request.module.css"
import {Button, Col, Row} from "react-bootstrap";
import {throwChallenge} from "../../../../../AWS_API";

export default function Request({opponent, thisUser, isIncoming}) {
    /**
     * @param e.max_wager
     */
    const maxWager = Math.min(thisUser.max_wager, thisUser.balance.N)
    //const maxWager = 10000000000;
    const [wager, setWager] = React.useState(maxWager)
    const [wasSent, setWasSent] = React.useState(false)
    const [isChangingWager, setIsChangingWager] = React.useState(false)
    const [changingWager, setChangingWager] = React.useState(maxWager)

    async function handleThrow() {
        try {
            await throwChallenge(opponent.username, wager);
        } catch (e) {
            console.log(e.message)
        }
    }

    function handleOnChange(event, minDisplayableValue) {
        let value = parseInt(event.target.value)
        if (isNaN(value)) value = minDisplayableValue;
        if (value > maxWager) value = maxWager;
        setChangingWager(value)
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
                               value={changingWager} defaultValue={maxWager}
                               onChange={event => handleOnChange(event, 0)} disabled={!isChangingWager}/>
                        {isChangingWager &&
                        <input type="range" className={s.wagerRangeInput}
                               min={1} max={maxWager} step={1} value={changingWager} defaultValue={maxWager}
                               onChange={event => handleOnChange(event, 1)}/>}
                    </div>
                </Col>
                {isIncoming ? <Col className={s.incomingRequestButtons}>
                    <Button variant="outline-success" block>
                        Принять
                    </Button>
                    <Button variant="outline-secondary" block>
                        Изменить ставку
                    </Button>
                    <Button variant="danger" block>
                        Отклонить
                    </Button>
                </Col> : <Col className={s.outcomingRequestButtons}>
                    <Button variant="outline-success" block onClick={() => {
                        handleThrow().then(() => {
                            setWasSent(true)
                        })
                    }} disabled={wasSent || isChangingWager}>
                        Предложить
                    </Button>
                    {isChangingWager ?
                        <Button variant="success" block onClick={() => {
                            setWager(changingWager)
                            setIsChangingWager(false)
                        }} disabled={changingWager === 0}>
                            Сохранить
                        </Button> :
                        <Button variant="outline-secondary" block onClick={() => {
                            setIsChangingWager(true)
                        }}>
                            Изменить ставку
                        </Button>}
                    <Button variant="danger" block>
                        Отменить
                    </Button>
                </Col>}

            </Row>
        </div>
    )
}