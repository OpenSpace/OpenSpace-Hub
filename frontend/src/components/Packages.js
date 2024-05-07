import React from 'react';
import ItemList from './ItemList';

function Packages({ user, config }) {
    return <ItemList user={user} type="package" config={config} />;
}

export default Packages;