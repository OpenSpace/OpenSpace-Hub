import React from 'react';
import ItemList from './ItemList';

function Assets({ user, config }) {
    return <ItemList user={user} type="asset" config={config} />;
}

export default Assets;