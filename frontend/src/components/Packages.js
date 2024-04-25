import React from 'react';
import ItemList from './ItemList';

function Packages({ user }) {
    return <ItemList user={user} type="package" />;
}

export default Packages;