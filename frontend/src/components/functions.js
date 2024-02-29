import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import openspaceApi from 'openspace-api-js';

const Functions = () => {
    const [isConnected, setIsConnected] = useState(false);

    const connectToOpenSpace = () => {
        // setup the api params
        const host = "127.0.0.1";
        const socket = openspaceApi(host, 4682);

        //notify users on disconnect
        socket.onDisconnect(() => {
            alert("Connection Error! Please start OpenSpace software and try again.");
            setIsConnected(false);
        });
        //notify users and map buttons when connected
        socket.onConnect(async () => {
            setIsConnected(true);
        })
        //connect
        socket.connect();
    }
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