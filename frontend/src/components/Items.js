import React from 'react';
import ItemList from './ItemList';

function Items({ user, config }) {
    return <ItemList user={user} type="all" config={config} />;
}

export default Items;