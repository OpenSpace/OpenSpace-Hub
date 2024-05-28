import React from 'react';
import ItemList from './ItemList';

function Configs({ user, config, setRedAlertMessage, setGreenAlertMessage }) {
    return <ItemList user={user} type="config" config={config} setRedAlertMessage={setRedAlertMessage} setGreenAlertMessage={setGreenAlertMessage} />;
}

export default Configs;