import React, {useEffect, useState} from "react";
import {loadTop} from "../../../../AWS_API";
import s from "./Top.module.css";
import Loading from "../Loading/Loading";

export default function Top(props) {
    const [top, setTop] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            try {
                return await loadTop();
            } catch (e) {
                console.log(e);
                alert(e);
            }
        }

        let isMounted = true;
        onLoad().then(top => {
            if (isMounted) {
                setTop(top);
                setIsLoading(false);
            }
        });

        return () => {isMounted = false;}
    }, []);

    function renderTop(top) {
        return top.map((player, i) => i < 50 ? (
            <tr key={i + 1}>
                <th scope="row">{i + 1}</th>
                <td>{player.username.S}</td>
                <td>{player.rating.N}</td>
            </tr>
        ) : (<></>));
    }

    return (
        <div className={s.Top}>
            {isLoading ? <Loading t={props.Loading}/> :
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">{props.t.Sharp}</th>
                        <th scope="col">{props.t.Username}</th>
                        <th scope="col">{props.t.Rating}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderTop(top)}
                    </tbody>
                </table>
            }
        </div>
    );
}
