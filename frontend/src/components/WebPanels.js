import React from 'react';
import ItemList from './ItemList';

function WebPanels({ user }) {
    return <ItemList user={user} type="webpanel" />;
}

export default WebPanels;