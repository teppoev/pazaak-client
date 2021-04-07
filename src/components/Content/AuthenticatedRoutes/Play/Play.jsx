import React from "react";
import {disconnectUser, getWebSocket, loadProfile} from "../../../../AWS_API";
import Loading from "../Loading/Loading";
import SearchGame from "./SearchGame/SearchGame";
import Field from "./Field/Field";
import s from "./Play.module.css"

export default function Play() {
    /**
     * @param e.opponentname
     * @param e.current_match_id
     * @param e.match_id
     */
    const ws = React.useRef({});

    const [isLoading, setIsLoading] = React.useState(true)
    const [currentMatchID, setCurrentMatchID] = React.useState({})

    React.useEffect(() => {
        async function onLoad() {
            return {
                thisUser: await loadProfile(),
                webSocket: await getWebSocket()
            };
        }

        let isMounted = true;
        onLoad().then(({thisUser, webSocket}) => {
                if (isMounted) {
                    setCurrentMatchID(thisUser.current_match_id);
                    ws.current = webSocket;
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

    return (
        <div className={s.playWrapper}>
            {isLoading ?
                <Loading size="lg" t={{Loading: "Загрузка..."}}/> :
                ("NULL" in currentMatchID ?
                    <SearchGame ws={ws.current} setCurrentMatchID={setCurrentMatchID}/> :
                    <Field ws={ws.current} currentMatchID={currentMatchID} setCurrentMatchID={setCurrentMatchID}/>)
            }
        </div>
    )
}