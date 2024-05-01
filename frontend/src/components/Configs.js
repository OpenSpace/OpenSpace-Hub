import React from 'react';
import ItemList from './ItemList';

function Configs({ user, config}) {
    return <ItemList user={user} type="config" config={config} />;
}

export default Configs;