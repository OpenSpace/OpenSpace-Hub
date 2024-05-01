import React from 'react';
import ItemList from './ItemList';

function Profiles({ user, config }) {
    return <ItemList user={user} type="profile" config={config} />;
}

export default Profiles;