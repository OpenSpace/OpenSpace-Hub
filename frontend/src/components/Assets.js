import React from 'react';
import ItemList from './ItemList';

function Assets({ user }) {
    return <ItemList user={user} type="asset" />;
}

export default Assets;