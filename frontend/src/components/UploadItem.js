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

    const [description, setDescription] = useState('');

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const [image, setImage] = useState(null);
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const [title, setTitle] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const [license, setLicense] = useState('');
    const handleLicenseChange = (e) => {
        setLicense(e.target.value);
    }

    const [video, setVideo] = useState('');
    const handleVideoChange = (e) => {
        setVideo(e.target.value);
    }

    //To-Do: Remove this method. Already handled in HTML input tag.
    const isValidateFileType = (file) => {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        if (fileExtension !== 'zip' && fileExtension !== 'asset') {
            document.getElementById('fileInput').value = '';
            return true;
        }
        return true;
    }

    const handleUpload = async (event) => {
        event.preventDefault();

        if (video != ''){
            const formData = new FormData();
            formData.append('video', video);
            formData.append('title', title);
            formData.append('itemType', itemType.toLowerCase());
            formData.append('license', license);
            formData.append('description', description);
            await APIService.UploadItem(formData)
                .then(data => {
                    alert(data.message);
                    handleClose();
                    redirectToHome();
                })
                .catch(err => {
                    alert("Error uploading item");
                    console.log(err);
                });
            return;
        }
        else{
            if (!file || title.trim() === '' || itemType.trim() === '' || license.trim() === '' || description.trim() === '' || !image) {
                alert('Please fill in all fields.');
                return;
            }
            if (file && isValidateFileType(file)) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('image', image);
                formData.append('fileName', file.name);
                formData.append('title', title);
                formData.append('itemType', itemType.toLowerCase());
                formData.append('license', license);
                formData.append('description', description);
                await APIService.UploadItem(formData)
                    .then(data => {
                        alert(data.message);
                        handleClose();
                        redirectToHome();
                    })
                    .catch(err => {
                        alert("Error uploading item");
                        console.log(err);
                    });
                return;
            } else {
                alert('Please select a valid file to upload.');
                return;
            }
        }
    }

    const redirectToHome = () => {
        window.location.href = "/";
    };

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
                        <h5 style={{ marginTop: '20px' }} >Description</h5>
                        <input type="text" value={description} onChange={handleDescription} />
                        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <Dropdown onSelect={handleItemTypeSelect} >
                                <h5>Item Type</h5>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {itemType}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="asset">Asset</Dropdown.Item>
                                    <Dropdown.Item eventKey="profile">Profile</Dropdown.Item>
                                    <Dropdown.Item eventKey="recording">Recording</Dropdown.Item>
                                    <Dropdown.Item eventKey="webpanel">Web Panel</Dropdown.Item>
                                    <Dropdown.Item eventKey="video">Video</Dropdown.Item>
                                    <Dropdown.Item eventKey="config">Config</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h5> License </h5>
                            <input type="text" value={license} onChange={handleLicenseChange} />
                        </div>

                        {(itemType === 'config' || itemType === 'video') ? null :
                            (
                                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                    <h5>Upload item-image <p style={{ fontSize: "15px" }}></p></h5>
                                    <input id='imageInput' type="file" accept=".jpg, .jpeg, .png" onChange={handleImageChange} />
                                </div>
                            )
                        }

                        {itemType === 'asset' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                            </div>
                        ) : itemType === 'profile' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .profile)</p></h5>
                                <input id='fileInput' type="file" accept=".profile" onChange={handleFileChange} />
                            </div>
                        ) : itemType === 'recording' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .osrec, .osrectxt)</p></h5>
                                <input id='fileInput' type="file" accept=".osrec, .osrectxt" onChange={handleFileChange} />
                            </div>
                        ) : itemType === 'webpanel' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip)</p></h5>
                                <input id='fileInput' type="file" accept=".zip" onChange={handleFileChange} />
                            </div>
                        ) : itemType === 'video' ? (
                            <>
                                <h5> Video Link </h5>
                                <input type="text" value={video} onChange={handleVideoChange} />
                            </>
                        ) : itemType === 'config' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .json)</p></h5>
                                <input id='fileInput' type="file" accept=".json" onChange={handleFileChange} />
                            </div>
                        ) : (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                            </div>
                        )}

                        {/* <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                            <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                        </div> */}
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