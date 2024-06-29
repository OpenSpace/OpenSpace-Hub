import React from 'react';
import ItemList from './ItemList';

function Items({ user, config, redAlertMessage, greenAlertMessage, setRedAlertMessage, setGreenAlertMessage }) {
    return <ItemList
        user={user}
        type="all"
        config={config}
        setRedAlertMessage={setRedAlertMessage}
        setGreenAlertMessage={setGreenAlertMessage} />;
}

export default Items;