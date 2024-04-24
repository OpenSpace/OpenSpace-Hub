import React from 'react';
import ItemList from './ItemList';

function Recordings({ user }) {
    return <ItemList user={user} type="recording" />;
}

export default Recordings;