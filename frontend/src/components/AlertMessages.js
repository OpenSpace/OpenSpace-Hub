import React, { useState, useEffect } from 'react';

const AlertMessages = ({ redAlertMessage, greenAlertMessage, clearRedAlertMessage, clearGreenAlertMessage }) => {
    const [showRedAlert, setShowRedAlert] = useState(redAlertMessage !== '');
    const [showGreenAlert, setShowGreenAlert] = useState(greenAlertMessage !== '');
    useEffect(() => {
        if (redAlertMessage !== '') {
            setShowRedAlert(true);
            const timer = setTimeout(() => {
                setShowRedAlert(false);
                clearRedAlertMessage();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [redAlertMessage]);

    useEffect(() => {
        if (greenAlertMessage !== '') {
            setShowGreenAlert(true);
            const timer = setTimeout(() => {
                setShowGreenAlert(false);
                clearGreenAlertMessage();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [greenAlertMessage]);

    return (
        <div>
            {showRedAlert && (
                <div className="alert alert-danger" role="alert">
                    {redAlertMessage}
                </div>
            )}
            {showGreenAlert && (
                <div className="alert alert-success" role="alert">
                    {greenAlertMessage}
                </div>
            )}
        </div>
    );
}

export default AlertMessages;
