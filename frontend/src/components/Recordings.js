import React from 'react';
import ItemList from './ItemList';

function Recordings({ user, config }) {
    return <ItemList user={user} type="recording" config={config} />;
}

export default Recordings;