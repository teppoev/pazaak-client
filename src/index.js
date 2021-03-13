import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import Amplify from 'aws-amplify';
import config from './config';
import strings from './string_consts';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: config.apiGateway.rest.NAME,
                endpoint: config.apiGateway.rest.URL,
                region: config.apiGateway.rest.REGION
            },
            {
                name: config.apiGateway.webSockets.NAME,
                endpoint: config.apiGateway.webSockets.CONNECTION_URL,
                region: config.apiGateway.webSockets.REGION
            }
        ]
    }
});

ReactDOM.render(
    <BrowserRouter>
        <App t={strings}/>
    </BrowserRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
