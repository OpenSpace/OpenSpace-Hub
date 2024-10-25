import React from 'react';
import ItemList from './ItemList';

function Videos({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
  return (
    <ItemList
      user={user}
      type="video"
      config={config}
      setRedAlertMessage={setRedAlertMessage}
      setGreenAlertMessage={setGreenAlertMessage}
    />
  );
}

export default Videos;
