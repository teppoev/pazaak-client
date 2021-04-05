import React from "react";
import {disconnectUser, getConnectedUsers, getWebSocket, loadProfile} from "../../../../AWS_API";
import Loading from "../Loading/Loading";
import s from "./Play.module.css"
import {Col, Container, Row} from "react-bootstrap";
import Request from "./Request/Request";
import RequestButton from "./RequestButton/RequestButton";

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

export default function Play() {
    const ws = React.useRef({});
    const [connectedUsers, setConnectedUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [requestsIn, setRequestsIn] = React.useState([]);
    const [requestOut, setRequestOut] = React.useState({
        username: "",
        rating: 0,
        wager: 0
    });
    const [account, setAccount] = React.useState({})

    React.useEffect(() => {
        async function onLoad() {
            return {
                webSocket: await getWebSocket(),
                connectedUsers: await getConnectedUsers(),
                thisUser: await loadProfile()
            };
        }

        let isMounted = true;
        onLoad().then(({webSocket, connectedUsers, thisUser}) => {
                if (isMounted) {
                    setAccount(thisUser);
                    connectedUsers = connectedUsers.filter(i => i.username !== thisUser.username.S);
                    connectedUsers.sort((a, b) => a.rating < b.rating);
                    setConnectedUsers(connectedUsers);

                    ws.current = webSocket;

                    ws.current.onmessage = evt => {
                        // listen to data sent from the websocket server
                        const message = JSON.parse(evt.data)
                        switch (message.action) {
                            case "add user": {
                                if (message.body.username === thisUser.username.S) break;
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
                                break;
                            }
                            case "add request": {
                                setRequestsIn(oldList => {
                                    let newList = [...oldList];
                                    newList.splice(0, 0, message.body)
                                    return newList;
                                })
                                break;
                            }
                            default: {
                                console.log(`Got unknown action: ${message.action}!`)
                            }
                        }
                    }

                    ws.current.onclose = () => {
                    }

                    setIsLoading(false);
                }
            }
        );

        return () => {
            if ("url" in ws.current) {
                ws.current.close();
            }
            if (isMounted) {
                disconnectUser().then(() => {
                    isMounted = false;
                }).catch((e) => {
                    console.log(e.message)
                })
            }
        }
    }, [])

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
                <Request thisUser={account}
                         opponent={{username: requestOut.username, rating: requestOut.rating}}/>}
                {requestsIn.length > 0 &&
                requestsIn.map((e, i) =>
                    <Request key={i} thisUser={account} isIncoming
                             opponent={{username: e.username, rating: e.rating}}/>)}
            </div>
        }
    }

    function isDisabled() {
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
                <RequestButton key={i} element={e} isDisabled={isDisabled}
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
                        Максимальная ставка: {isLoading ?
                        <Loading size="sm"/> : Math.min(account.max_wager, account.balance.N)}
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
                    <Row>
                        <Col className={s.userName} xl={10} lg={10} md={9} sm={9} xs={9}><h6>Имя пользователя</h6>
                        </Col>
                        <Col className={s.rating}><h6>Рейтинг</h6></Col>
                    </Row>
                    <hr/>
                    <div className={s.players}>
                        {isLoading ? <Loading/> : renderPlayers()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}