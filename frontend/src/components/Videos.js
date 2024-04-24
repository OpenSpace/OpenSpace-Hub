import React from 'react';
import ItemList from './ItemList';

function Videos({ user }) {
    return <ItemList user={user} type="video" />;
}

export default Videos;