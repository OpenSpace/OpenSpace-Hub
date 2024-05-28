import React from 'react';
import ItemList from './ItemList';

function UserItems({ user, config, setRedAlertMessage, setGreenAlertMessage}) {
    return (
        <>
            {
                user && user.username ? 
                    (<ItemList user={user} type="all" config={config} filterByUsername={true} setRedAlertMessage={setRedAlertMessage} setGreenAlertMessage={setGreenAlertMessage} />)
                : 
                <div></div>
            }
        </>)
}

export default UserItems;