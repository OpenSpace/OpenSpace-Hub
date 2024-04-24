import React from 'react';
import ItemList from './ItemList';

function Items({ user }) {
    return <ItemList user={user} type="all" />;
}

export default Items;