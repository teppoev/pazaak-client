import React from "react"
import {Button, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import s from "../Play.module.css";

export default function RequestButton({element, setRequestOut, isDisabled}) {
    function renderButton(isDisabled) {
        return (
            <Button className={s.renderButton} variant="outline-secondary" block onClick={() => {
                    setRequestOut({username: element.username, rating: element.rating})
            }} disabled={isDisabled} style={isDisabled ? {pointerEvents: "none"} : {}}>
                <Row>
                    <Col className={s.userName} xl={10} lg={10} md={9} sm={9} xs={9}>{element.username}</Col>
                    <Col className={s.rating}>{element.rating}</Col>
                </Row>
            </Button>
        )
    }

    if (isDisabled()) return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
            Чтобы предложить другую партию, отмените действующее предложение!
        </Tooltip>}>
            <span>
                {renderButton(isDisabled())}
            </span>
        </OverlayTrigger>
    )
    else return (
        renderButton()
    )
}