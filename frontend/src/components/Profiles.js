import React from 'react';
import ItemList from './ItemList';

function Profiles({ user }) {
    return <ItemList user={user} type="profile" />;
}

export default Profiles;