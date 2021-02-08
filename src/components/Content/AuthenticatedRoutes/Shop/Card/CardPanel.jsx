import React, {useState} from "react";
import {OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import s from "./CardPanel.module.css";
import LoaderButton from "../../../LoaderButton/LoaderButton";
import {patchAccount} from "../../../../../AWS_API";
import Card from "../../Card/Card";
import Loading from "../../Loading/Loading";

export default function CardPanel(props) {
    const [isLoading, setIsLoading] = useState(false);

    function validateEnoughMoney() {
        return parseInt(props.credits) >= parseInt(props.card.value.N);
    }

    async function handleBuy() {
        setIsLoading(true);

        try {
            const response = await patchAccount(props.card.card_id.N);
            if (response.message === "You don't have enough money") alert("Недостаточно кредитов!");
            else {
                props.setCredits(response.balance.N);
                props.setMyCards(response.cards.M);
                alert("Успешно!");
            }
        } catch (e) {
            console.log(e.message);
            alert(e.message);
        }

        setIsLoading(false);
    }

    function renderIcons() {
        switch (props.card.card_type.S) {
            case "changeable": {
                let positiveSignName = "+" + props.card.card_name.S[1];
                let negativeSignName = "-" + props.card.card_name.S[1];
                return (
                    <div className={`${s.CardIcons}`}>
                        <div className={`${s.CardIconWrapper}`}>
                            <Card cardType={"changeable"} cardName={positiveSignName}/>
                        </div>
                        <div className={`${s.CardIconWrapper}`}>
                            <Card cardType={"reverse-changeable"} cardName={negativeSignName}/>
                        </div>

                    </div>
                )
            }
            default: {
                return (
                    <Card cardName={props.card.card_name.S}
                          cardType={props.card.card_type.S}/>
                )
            }
        }
    }

    return (
        <div>
            {
                props.isLoadingCardPanel ? <Loading t={props.Loading}/> :
                    <div>
                        <Table bordered className={`${s.CardTable}`}>
                            <tbody>
                            <tr>
                                <td colSpan={2}>
                                    <div className={`${s.CardIconsWrapper}`}>
                                        {renderIcons()}
                                    </div>
                                </td>
                            </tr>
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
            }

        </div>
    )
}
