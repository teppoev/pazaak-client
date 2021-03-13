import React from "react";
import {disconnectUser, getConnectedUsers, getUserName, getWebSocket} from "../../../../AWS_API";
import Loading from "../Loading/Loading";

function locationOf(element, array, start=0, end=array.length) {
    let pivot = Math.floor(start + (end - start) / 2);
    if(array[pivot] === element) return -1;
    if (end - start < 1) return pivot;
    if (array[pivot] < element) {
        return locationOf(element, array, pivot + 1, end);
    } else {
        return locationOf(element, array, start, pivot);
    }
}

export default function Play() {
    const ws = React.useRef({});
    const [connectedUsers, setConnectedUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function onLoad() {
            return {
                webSocket: await getWebSocket(),
                connectedUsers: await getConnectedUsers(),
                thisUser: await getUserName()
            };
        }

        let isMounted = true;
        onLoad().then(({webSocket, connectedUsers, thisUser}) => {
                if (isMounted) {
                    if (connectedUsers.indexOf(thisUser) === -1) connectedUsers.push(thisUser);
                    connectedUsers.sort();
                    setConnectedUsers(connectedUsers);
                    //those warnings below are bugs: https://youtrack.jetbrains.com/issue/WEB-43129
                    ws.current = webSocket;
                    ws.current.onopen = () => {
                        console.log(`${thisUser} connected`);
                    }

                    ws.current.onmessage = evt => {
                        // listen to data sent from the websocket server
                        const message = JSON.parse(evt.data)
                        console.log(message)
                        switch (message.action) {
                            case "add": {
                                setConnectedUsers(oldList => {
                                    let newList = [...oldList];
                                    let loc = locationOf(message.username, oldList);
                                    if (loc !== -1) newList.splice(loc, 0, message.username)
                                    return newList;
                                })
                                break;
                            }
                            case "remove": {
                                setConnectedUsers(oldList => oldList.filter(i => i !== message.username))
                                break;
                            }
                            default: {
                                console.log("Got unknown action!")
                            }
                        }
                    }

                    ws.current.onclose = () => {
                        console.log(`${thisUser} disconnected`);
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
                }).catch((e) => console.log(e.message))
            }
        }
    }, [])

    function renderPlayers() {
        return connectedUsers.map((e, i) => <div key={i}>{e}</div>)
    }

    return (
        <div>
            {isLoading ? <Loading/> : renderPlayers()}
        </div>
    );
}