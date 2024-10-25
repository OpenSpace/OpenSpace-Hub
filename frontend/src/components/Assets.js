import React from 'react';
import ItemList from './ItemList';

function Assets({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
  return (
    <ItemList
      user={user}
      type="asset"
      config={config}
      setRedAlertMessage={setRedAlertMessage}
      setGreenAlertMessage={setGreenAlertMessage}
    />
  );
}

export default Assets;
