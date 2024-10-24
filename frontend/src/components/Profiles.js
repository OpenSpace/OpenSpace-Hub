import React from 'react';
import ItemList from './ItemList';

function Profiles({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
  return <ItemList user={user} type="profile" config={config} setRedAlertMessage={setRedAlertMessage} setGreenAlertMessage={setGreenAlertMessage} />;
}

export default Profiles;
