import React from 'react';
import ItemList from './ItemList';

function UserItems({ user, config }) {
    return (
        <>
            {
                user && user.username ? 
                    (<ItemList user={user} type="all" config={config} filterByUsername={true} />)
                : 
                <div></div>
            }
        </>)
}

export default UserItems;