import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import openspaceApi from 'openspace-api-js';

const Functions = () => {
    const [isConnected, setIsConnected] = useState(false);
    const connectToOpenSpace = async() => {
        // setup the api params
        const host = "127.0.0.1";
        const api = openspaceApi(host, 4682);        

        //notify users on disconnect
        api.onDisconnect(() => {
            alert("Connection Error! Please start OpenSpace software and try again.");
            setIsConnected(false);
        });
        //notify users and map buttons when connected
        api.onConnect(async () => {
            window.openspace = await api.library();
            setIsConnected(true);
        })
        //connect
        api.connect();
    }

    useEffect(() => {
        connectToOpenSpace();
    });

    return (
        <>
            {isConnected ?
                (
                    <div>
                        <Button disable variant="success">Connected</Button>{' '}
                    </div>
                ) :
                (
                    <div>
                        <Button onClick={connectToOpenSpace} variant="danger">Click here to Connect</Button>{' '}
                    </div>
                )
            }
        </>

    );
}

export default Functions;