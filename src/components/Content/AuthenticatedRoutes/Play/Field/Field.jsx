import React from "react"
import {Button} from "react-bootstrap";
import {giveUpMatch} from "../../../../../AWS_API";

export default function Field({ws, currentMatchID, setCurrentMatchID}) {
    React.useEffect(() => {
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
    }, [ws, setCurrentMatchID])


    return (
        <div>
            <div>Партия #{currentMatchID.S}</div>
            <Button onClick={() => {
                giveUpMatch().then(() => {
                    setCurrentMatchID({NULL: true})
                })
            }}>Сдаться</Button>
        </div>
    )
}