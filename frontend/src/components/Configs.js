import React from 'react';
import ItemList from './ItemList';

function Configs({ user }) {
    return <ItemList user={user} type="config" />;
}

export default Configs;