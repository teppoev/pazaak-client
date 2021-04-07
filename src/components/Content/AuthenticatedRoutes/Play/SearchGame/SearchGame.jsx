import React from "react";
import s from "./SearchGame.module.css"
import {Col, Container, Row} from "react-bootstrap";
import Request from "./Request/Request";
import RequestButton from "./RequestButton/RequestButton";
import {getConnectedUsers, loadProfile} from "../../../../../AWS_API";
import Loading from "../../Loading/Loading";

function locationOf(element, array, start = 0, end = array.length, key = (e => e)) {
    let pivot = Math.floor(start + (end - start) / 2);
    if (array[pivot] === null && key(array[pivot]) === element) return -1;
    if (end - start < 1) return pivot;
    if (key(array[pivot]) < element) {
        return locationOf(element, array, pivot + 1, end, key);
    } else {
        return locationOf(element, array, start, pivot, key);
    }
}

export default function SearchGame({setCurrentMatchID, ws}) {
    const initialRequestOutState = React.useMemo(() => { return {
        username: "",
        rating: 0,
        wager: 0,
        wasChanged: false
    }}, [])
    const [account, setAccount] = React.useState({})
    const [connectedUsers, setConnectedUsers] = React.useState([])
    const [requestsIn, setRequestsIn] = React.useState([])
    const [requestOut, setRequestOut] = React.useState(initialRequestOutState)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function onLoad() {
            return {
                connectedUsers: await getConnectedUsers(),
                account: await loadProfile()
            };
        }

        let isMounted = true;
        onLoad().then(({connectedUsers, account}) => {
                if (isMounted) {
                    setAccount(account)
                    connectedUsers = connectedUsers.filter(i => i.username !== account.username.S);
                    connectedUsers.sort((a, b) => a.rating < b.rating);
                    setConnectedUsers(connectedUsers);

                    ws.onmessage = evt => {
                        // listen to data sent from the websocket server
                        const message = JSON.parse(evt.data)
                        switch (message.action) {
                            case "add user": {
                                if (message.body.username === account.username.S) break;
                                setConnectedUsers(oldList => {
                                    let newList = [...oldList];
                                    if (oldList.findIndex(el => el.username === message.body.username) === -1) {
                                        let loc = locationOf(message.body.rating, oldList, 0, oldList.length,
                                            (e => e.rating));
                                        newList.splice(loc, 0, message.body)
                                    }
                                    return newList;
                                })
                                break;
                            }
                            case "remove user": {
                                setConnectedUsers(oldList => oldList.filter(i => i.username !== message.username))
                                setRequestsIn(oldList => oldList.filter(i => i.username !== message.username))
                                setRequestOut(oldValue => {
                                    return oldValue.username === message.username ? initialRequestOutState : oldValue
                                })
                                break;
                            }
                            case "add request": {
                                let wasChanged = message.body.wasChanged
                                let body = {
                                    username: message.body.username,
                                    rating: message.body.rating,
                                    wager: message.body.wager
                                }
                                if (wasChanged) {
                                    setRequestOut(initialRequestOutState)
                                }
                                setRequestsIn(oldList => {
                                    if (oldList.indexOf(i => i.username === message.body.username) !== -1) return oldList;
                                    let newList = [...oldList];
                                    newList.splice(0, 0, body)
                                    return newList;
                                })
                                break;
                            }
                            case "remove cancelled request": {
                                setRequestsIn(oldList => oldList.filter(i => i.username !== message.username))
                                break;
                            }
                            case "remove denied request": {
                                setRequestOut(oldValue => {
                                    if (oldValue.username === message.username)
                                        return initialRequestOutState
                                    else return oldValue
                                })
                                break;
                            }
                            case "start game": {
                                alert("Game was started!")
                                setCurrentMatchID({S: message.body.match_id})
                                break;
                            }
                            default: {
                                console.log(`Got unknown action: ${message.action}!`)
                            }
                        }
                    }

                    setIsLoading(false);
                }
            }
        );

        ws.onclose = () => {
        }

        return () => {
            isMounted = false;
        }
    }, [initialRequestOutState, setCurrentMatchID, ws])

    function renderRequests() {
        if (requestsIn.length === 0 && requestOut.username === "") {
            return <Row>
                <Col className={s.emptyList}>
                    Запросов нет
                </Col>
            </Row>
        } else {
            return <div>
                {requestOut.username !== "" &&
                <Request account={account} setRequestOut={setRequestOut}
                         opponent={requestOut} initialRequestOutState={initialRequestOutState}/>}
                {requestsIn.length > 0 &&
                requestsIn.map((e, i) =>
                    <Request key={i} account={account} isIncoming
                             setRequestsIn={setRequestsIn} isRequestOutNotEmpty={isRequestOutNotEmpty}
                             setRequestOut={setRequestOut}
                             opponent={{username: e.username, rating: e.rating, wager: e.wager}}/>)}
            </div>
        }
    }

    function isRequestOutNotEmpty() {
        return requestOut.username !== "";
    }

    function renderPlayers() {
        if (connectedUsers.length === 0) {
            return <Row>
                <Col className={s.emptyList}>
                    Кажется, сейчас больше никто не хочет играть :(
                </Col>
            </Row>
        } else {
            return connectedUsers.map((e, i) =>
                <RequestButton key={i} element={e} isDisabled={isRequestOutNotEmpty}
                               setRequestOut={setRequestOut}/>)
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <span className={s.userInfo}>
                        Кредитов: {isLoading ? <Loading size="sm"/> : account.balance.N}
                    </span>
                    <span className={s.userInfo}>
                        Рейтинг: {isLoading ? <Loading size="sm"/> : account.rating.N}
                    </span>
                    <span className={s.userInfo}>
                        Максимальная ставка: {isLoading ? <Loading size="sm"/> : Math.min(account.max_wager, account.balance.N)}
                    </span>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className={s.listOfRequestsWrapper}>
                    <Row>
                        <Col>
                            <h4 className={s.header}>Активные запросы на партию:</h4>
                        </Col>
                    </Row>
                    {renderRequests()}
                </Col>
                <Col lg={6} className={s.listOfPlayersWrapper}>
                    <Row>
                        <Col>
                            <h2 className={s.header}>Выберите соперника:</h2>
                        </Col>
                    </Row>
                    <Row className={s.userNameAndRatingLabels}>
                        <Col className={s.userName} xl={10} lg={10} md={9} sm={9} xs={9}><h6>Имя пользователя</h6>
                        </Col>
                        <Col className={s.rating}><h6>Рейтинг</h6></Col>
                    </Row>
                    <hr/>
                    <div className={s.players}>
                        {isLoading ? <Loading size="sm"/> : renderPlayers()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}