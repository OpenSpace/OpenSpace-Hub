import React from 'react';
import ItemList from './ItemList';

function Recordings({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
  return (
    <ItemList
      user={user}
      type="recording"
      config={config}
      setRedAlertMessage={setRedAlertMessage}
      setGreenAlertMessage={setGreenAlertMessage}
    />
  );
}

export default Recordings;
