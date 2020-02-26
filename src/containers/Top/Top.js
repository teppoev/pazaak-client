import React, {useEffect, useState} from "react";
import {API} from 'aws-amplify';
import s from "./Top.module.css";
import {Spinner} from "react-bootstrap";

export default function Top(props) {
    const [top, setTop] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {

            try {
                const top = await loadTop();
                setTop(top);
            } catch (e) {
                console.log(e);
                alert(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, []);

    async function loadTop() {
        return API.get("pazaak-rest", "/users/rating");
    }

    function renderTop(top) {
        return top.map((player, i) => i < 50 ? (
            <tr key={i + 1}>
                <th scope="row">{i + 1}</th>
                <td>{player.user_id.S}</td>
                <td>{player.rating.N}</td>
            </tr>
        ) : (<></>));
    }

    return (
        <div className={s.Top}>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col" key>#</th>
                    <th scope="col">Имя пользователя</th>
                    <th scope="col">Рейтинг</th>
                </tr>
                </thead>
                <tbody>
                {!isLoading && renderTop(top)}
                </tbody>
            </table>
            {isLoading ? <h3 className={s.Top}>
                <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    style={{marginRight: 20 + 'px'}}
                />
                Загрузка свежих данных...
            </h3> : <></>}
        </div>
    );
}