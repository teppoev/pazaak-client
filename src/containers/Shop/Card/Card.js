import React, {useState} from "react";
import {OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import s from "./Card.module.css";
import LoaderButton from "../../../components/LoaderButton/LoaderButton";
import {API} from "aws-amplify";

export default function Card(props) {
    const [isLoading, setIsLoading] = useState(false);

    function validateEnoughMoney() {
        return parseInt(props.credits) >= parseInt(props.card.value.N);
    }

    async function patchAccount() {
        return API.put("pazaak-rest", "/account/cards/buy", {
            body: {
                cardID: props.card.card_id.N
            }
        });
    }

    async function handleBuy() {
        setIsLoading(true);

        try {
            const response = await patchAccount();
            if (response.message === "You don't have enough money") alert("Недостаточно кредитов!");
            else {
                props.setCredits(response.balance.N);
                props.setMyCards(response.cards.M);
                props.setCardNumber(parseInt(props.cardNumber) + 1);
                alert("Успешно!");
            }
        } catch (e) {
            console.log(e.message);
            alert(e.message);
        }

        setIsLoading(false);
    }

    return (
        <div>
            <Table bordered className={`${s.CardTable}`}>
                <tbody>
                <tr>
                    <td className={`${s.AttributeName}`}>Стоимость:</td>
                    <td className={`${s.AttributeValue}`}>{props.card.value.N}</td>
                </tr>
                <tr>
                    <td className={`${s.AttributeName}`}>В наличии игрока:</td>
                    <td className={`${s.AttributeValue}`}>{props.cardNumber}</td>
                </tr>
                <tr>
                    <td colSpan="2" className={`${s.CardDescription}`}>
                        {
                            props.card.description ? props.card.description.S : "undefined"
                        }
                    </td>
                </tr>
                </tbody>
            </Table>
            {validateEnoughMoney() ?
                <LoaderButton
                    className={`${s.ShopButton}`}
                    isLoading={isLoading}
                    onClick={handleBuy}>
                    Купить
                </LoaderButton> :
                <OverlayTrigger overlay={<Tooltip>Недостаточно кредитов!</Tooltip>}>
                <span>
                    <LoaderButton
                        className={`${s.ShopButton}`}
                        disabled
                        isLoading={isLoading}
                        style={{pointerEvents: 'none'}}
                        onClick={handleBuy}>
                        Купить
                    </LoaderButton>
                </span>
                </OverlayTrigger>
            }
        </div>
    )
}