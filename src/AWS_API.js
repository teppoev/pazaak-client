import {API, Auth, Signer} from "aws-amplify";
import config from "./config";

export async function getAccessToken() {
    return (await Auth.currentSession()).getAccessToken().getJwtToken();
}

export async function loadCards() {
    return API.get(config.apiGateway.rest.NAME, "/cards", {});
}

export async function loadProfile() {
    return API.get(config.apiGateway.rest.NAME, "/account/info", {
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function loadTop() {
    return API.get(config.apiGateway.rest.NAME, "/users/rating", {});
}

export async function buyCard(cardID) {
    return API.put(config.apiGateway.rest.NAME, "/account/buy-card", {
        body: {
            cardID: cardID
        },
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function changeDeck(newDeck, myCards) {
    return API.put(config.apiGateway.rest.NAME, "/account/change-deck", {
        body: {
            newDeck: newDeck,
            newCards: myCards
        },
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function disconnectUser() {
    return API.put(config.apiGateway.rest.NAME, "/users/connected/disconnect", {
        queryStringParameters: {
            accessToken: await getAccessToken()
        }
    });
}

export async function getWebSocket() {
    const credentials = await Auth.currentCredentials()
    const accessInfo = {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
    }
    const wssUrl = `${config.apiGateway.webSockets.URL}?accessToken=${await getAccessToken()}`
    const signedUrl = Signer.signUrl(wssUrl, accessInfo)

    return new WebSocket(signedUrl);
}

export async function getConnectedUsers() {
    return API.get(config.apiGateway.rest.NAME, "/users/connected", {});
}

export async function getUserName() {
    return (await Auth.currentUserInfo())['username'];
}