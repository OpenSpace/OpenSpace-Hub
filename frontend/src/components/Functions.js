import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import openspaceApi from 'openspace-api-js';

function Functions() {
  const [isConnected, setIsConnected] = useState(false);
  async function connectToOpenSpace() {
    // setup the api params
    const host = '127.0.0.1';
    const api = openspaceApi(host, 4682);
    let retry = 0;
    // notify users on disconnect
    api.onDisconnect(() => {
      if (retry < 2) {
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
      window.openspace = await api.singleReturnLibrary();
      setIsConnected(true);
      retry = 0;
    });
    // connect
    api.connect();
  }

  return (
    <>
      {isConnected ? (
        <Button disable variant="success">
          Connected
        </Button>
      ) : (
        <Button onClick={connectToOpenSpace} variant="outline-primary">
          Connect to OpenSpace
        </Button>
      )}
    </>
  );
}

export default Functions;
