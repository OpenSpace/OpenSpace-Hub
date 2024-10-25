import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import openspaceApi from 'openspace-api-js';

const Functions = () => {
  const [isConnected, setIsConnected] = useState(false);
  const connectToOpenSpace = async () => {
    // setup the api params
    const host = '127.0.0.1';
    const api = openspaceApi(host, 4682);
    let retry = 0;
    // notify users on disconnect
    api.onDisconnect(() => {
      if (retry < 2) {
        console.log('count: ', retry);
        api.connect();
        retry++;
      } else {
        alert('Connection Error! Please start OpenSpace software and try again.');
        setIsConnected(false);
        window.openspace = null;
      }
    });

    // notify users and map buttons when connected
    api.onConnect(async () => {
      window.openspace = await api.library();
      setIsConnected(true);
      retry = 0;
    });
    // connect
    api.connect();
  };

  return (
    <>
      {isConnected ? (
        <div>
          <Button disable variant="success">
            Connected
          </Button>{' '}
        </div>
      ) : (
        <div>
          <Button onClick={connectToOpenSpace} variant="danger">
            Click here to Connect
          </Button>{' '}
        </div>
      )}
    </>
  );
};

export default Functions;
