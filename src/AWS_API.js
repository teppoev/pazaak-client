import {API, Auth} from "aws-amplify";
import config from "./config";

export async function getAccessToken() {
    return (await Auth.currentSession()).getAccessToken().getJwtToken();
}

export async function loadCards() {
    return API.get(config.apiGateway.NAME, "/cards", {});
}

export async function loadProfile() {
    return API.get(config.apiGateway.NAME, "/account/info", {
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function loadTop() {
    return API.get(config.apiGateway.NAME, "/users/rating", {});
}

export async function patchAccount(cardID) {
    return API.put("pazaak-rest", "/account/cards/buy", {
        body: {
            cardID: cardID
        },
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function changeDeck(newDeck, myCards) {
    return API.put(config.apiGateway.NAME, "/account/deck/change", {
        body: {
            newDeck: newDeck,
            newCards: myCards
        },
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}