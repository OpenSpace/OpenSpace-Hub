import React from 'react';
import ItemList from './ItemList';

function WebPanels({ user, config, setRedAlertMessage, setGreenAlertMessage}) {
  return <ItemList user={user} type="webpanel" config={config} setRedAlertMessage={setRedAlertMessage} setGreenAlertMessage={setGreenAlertMessage} />;
}

export default WebPanels;
