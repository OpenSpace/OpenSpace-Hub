import React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import APIService from './APIService';


const UploadItem = () => {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [itemType, setItemType] = useState('Asset');

    const handleItemTypeSelect = (e) => {
        setItemType(e);
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const [title, setTitle] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const [license, setLicense] = useState('');

    const handleLicenseChange = (e) => {
        setLicense(e.target.value);
    }

    const validateFileType = (file) => {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        if (fileExtension !== 'zip' && fileExtension !== 'asset') {
            alert('Invalid file type. Please upload a .zip or .asset file.');
            return;
        }
    }

    const handleUpload = async(event) => {
        event.preventDefault();
        if (file) {
            validateFileType(file);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);
            formData.append('title', title);
            formData.append('itemType', itemType);
            formData.append('license', license);
            await APIService.UploadItem(formData)
                .then(data => {
                    alert(data.message);
                    handleClose();
                })
                .catch(err => {
                    alert("Error uploading file");
                    console.log(err);
                });
                return;
        } else {
            alert('Please select a file to upload.');
            return;
        }
    }


    return (
        <>
            <Button onClick={handleShowModal} variant="dark">
                Upload an Item
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload an Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5>Title</h5>
                        <input type="text" value={title} onChange={handleTitleChange} />
                        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <Dropdown onSelect={handleItemTypeSelect} >
                                <h5>Item Type</h5>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {itemType}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Asset">Asset</Dropdown.Item>
                                    <Dropdown.Item eventKey="Profile">Profile</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <h5> License </h5>
                        <input type="text" value={license} onChange={handleLicenseChange} />
                        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default UploadItem;