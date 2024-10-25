import React from 'react';
import ItemList from './ItemList';

function Packages({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
  return (
    <ItemList
      user={user}
      type="package"
      config={config}
      setRedAlertMessage={setRedAlertMessage}
      setGreenAlertMessage={setGreenAlertMessage}
    />
  );
}

export default Packages;
