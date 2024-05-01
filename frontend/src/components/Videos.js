import React from 'react';
import ItemList from './ItemList';

function Videos({ user, config }) {
    return <ItemList user={user} type="video" config={config} />;
}

export default Videos;