import React from 'react';
import ItemList from './ItemList';

function WebPanels({ user, config }) {
    return <ItemList user={user} type="webpanel" config={config} />;
}

export default WebPanels;