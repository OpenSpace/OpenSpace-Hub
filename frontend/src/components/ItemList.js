import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import APIService from './APIService';
import { Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';

function ItemList({ user, type, config }) {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClose = () => setShowModal(false);

    const [name, setName] = useState('');
    const handleNameChange = (e) => {
        setSelectedItem({ ...selectedItem, name: e.target.value });
    }
    const [description, setDescription] = useState('');
    const handleDescription = (e) => {
        setSelectedItem({ ...selectedItem, description: e.target.value });
    }

    const [openspaceVersion, setOpenspaceVersion] = useState('');
    const handleOpenSpaceVersionSelect = (e) => {
        setOpenspaceVersion(e);
        setSelectedItem({ ...selectedItem, openspaceVersion: e });
    }

    const [openspaceVersions, setOpenspaceVersions] = useState([]);
    useEffect(() => {
        if (config && config.config && config.config.versions) {
            setOpenspaceVersions(config.config.versions);
        }
    }, [config]);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadItems();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchTerm]);

    const loadItems = async () => {
        try {
            const resp = await APIService.GetItems({
                type,
                search: searchTerm,
                page: currentPage
            });
            setItems(resp.items);
            setTotalPages(Math.ceil(resp.total / resp.limit));
        } catch (error) {
            console.log(`Error loading items: `, error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleImageChange = (e) => {
        setSelectedItem({ ...selectedItem, image: e.target.files[0] });
    }

    const handleFileChange = (e) => {
        setSelectedItem({ ...selectedItem, file: e.target.files[0] });
    }

    const [video, setVideo] = useState('');
    const handleVideoChange = (e) => {
        setSelectedItem({ ...selectedItem, video: e.target.value });
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const isAdminUser = () => {
        return (user.role === 'admin');
    }

    const deleteItem = async (item) => {
        await APIService.DeleteItem(item._id)
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error);
                }
                setItems(items.filter(i => i._id !== item._id));
                alert("Item deleted successfully");
            })
            .catch(error => {
                console.log(error);
                alert("Error deleting item. ", error.message);
            })
    }

    const editItem = (item) => {
        setSelectedItem(item);
        setName(item.name);
        setDescription(item.description);
        setOpenspaceVersion(item.openspaceVersion);
        setShowModal(true);
    };

    const [acceptTerms, setAcceptTerms] = useState(false); // State to track whether terms are accepted
    const handleAcceptTerms = () => {
        setAcceptTerms(!acceptTerms); // Toggle the value when checkbox is clicked
    }

    const handleModalSave = async (event) => {
        event.preventDefault();
        if (!acceptTerms) {
            alert('Please accept the terms and conditions.');
            return;
        }
        else {
            const formData = new FormData();
            if (selectedItem && selectedItem.file) {
                formData.append('file', selectedItem.file);
                formData.append('fileName', selectedItem.file.name);
            }
            if (selectedItem && selectedItem.image) {
                formData.append('image', selectedItem.image);
            }
            if (selectedItem && selectedItem.video) {
                formData.append('video', selectedItem.video);
            }
            formData.append('itemType', selectedItem.type);
            formData.append('openspaceVersion', selectedItem.openspaceVersion);
            formData.append('name', selectedItem.name);
            formData.append('description', selectedItem.description);
            await APIService.UpdateItem(selectedItem._id, formData)
                .then(resp => {
                    if (resp.error) {
                        throw new Error(resp.error);
                    }
                    alert(resp.message);
                    setItems(items.map(i => i._id === selectedItem._id ? resp.item : i));
                    handleClose();
                })
                .catch(err => {
                    alert("Error uploading item. " + err.message);
                    console.log(err);
                });
            return;
        }
    }

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="pt-3 px-4">
            <div className="text-center fw-bold fs-4">
                <u>{type === "asset" ? "Assets" :
                    type === "profile" ? "Profiles" :
                        type === "webpanel" ? "Web Panels" :
                            type === "config" ? "Configs" :
                                type === "video" ? "Videos" :
                                    type === "recording" ? "Recordings" :
                                        type === "package" ? "Packages" :
                                            "Hub Items"}</u>
            </div>
            <Modal show={showModal} onHide={handleModalCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5>Name</h5>
                        <input type="text" defaultValue={selectedItem?.name} onChange={handleNameChange} />
                        <h5 style={{ marginTop: '20px' }} >Description</h5>
                        <textarea rows={3} defaultValue={selectedItem?.description} onChange={handleDescription} />
                        <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                            <Dropdown onSelect={handleOpenSpaceVersionSelect} >
                                <h5>OpenSpace Version <p style={{ fontSize: "15px" }}>(Make sure it runs on the selected version)</p></h5>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {selectedItem? (selectedItem.openspaceVersion ? openspaceVersion : 'Select version'): null}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {openspaceVersions.map((version) => (
                                        <Dropdown.Item key={version} eventKey={version}>{version}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        {(selectedItem?.type === 'config' || selectedItem?.type === 'video') ? null :
                            (
                                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                    <h5>Upload item-image <p style={{ fontSize: "15px" }}>(accepted formats: .jpg, .jpeg, .png)</p></h5>
                                    <input id='imageInput' type="file" accept=".jpg, .jpeg, .png" onChange={handleImageChange} />
                                </div>
                            )
                        }

                        {selectedItem?.type === 'asset' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                            </div>
                        ) : selectedItem?.type === 'profile' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .profile)</p></h5>
                                <input id='fileInput' type="file" accept=".profile" onChange={handleFileChange} />
                            </div>
                        ) : selectedItem?.type === 'recording' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .osrec, .osrectxt)</p></h5>
                                <input id='fileInput' type="file" accept=".osrec, .osrectxt" onChange={handleFileChange} />
                            </div>
                        ) : selectedItem?.type === 'webpanel' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip)</p></h5>
                                <input id='fileInput' type="file" accept=".zip" onChange={handleFileChange} />
                            </div>
                        ) : selectedItem?.type === 'video' ? (
                            <>
                                <h5> Video Link </h5>
                                <input type="text" value={video} onChange={handleVideoChange} />
                            </>
                        ) : selectedItem?.type === 'config' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .json)</p></h5>
                                <input id='fileInput' type="file" accept=".json" onChange={handleFileChange} />
                            </div>
                        ) : selectedItem?.type === 'package' ? (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                            </div>
                        ) : (
                            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
                            </div>
                        )}
                    </form>
                    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <input type="checkbox" checked={acceptTerms} onChange={handleAcceptTerms} />
                        <label htmlFor="acceptTerms">I accept the terms and conditions</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleModalSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="pt-3 px-4">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Form.Group>
            </div>
            <Row xs={1} md={3} className="g-4">
                {items.map(item => (
                    <Col key={item.id}>
                        <Card>
                            {item.image && item.image !== 'no-image' &&
                                <Card.Img variant="top" src={item.image} />
                            }
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    {item.description}
                                </Card.Text>
                                <Card.Text>
                                    <b>Type: </b>
                                    {item.type}
                                </Card.Text>
                                <Card.Text>
                                    <b>Author: </b>
                                    <Card.Link href={item.author.link}>{item.author.name}</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>License: </b>
                                    {item.license}
                                </Card.Text>
                                <Card.Text>
                                    <b>OpenSpace Version: </b>
                                    {item.openspaceVersion}
                                </Card.Text>
                                {item.currentVersion &&
                                    <Card.Text>
                                        <b>Current Version: {item.currentVersion.version} </b>
                                        <Card.Link href={item.currentVersion.url}>Download</Card.Link>
                                    </Card.Text>
                                }
                                {item.archives && item.archives.length > 0 &&
                                    <Card.Text>
                                        <b>Other Versions: </b>
                                        {item.archives.map(version => (
                                            <Card.Link key={version.version} href={version.url}>{version.version}</Card.Link>
                                        ))}
                                    </Card.Text>
                                }
                                <Card.Text>
                                    <b>Last Update: </b> {item.modified}
                                </Card.Text>

                                {item.type === "video" ?
                                    <Button variant="primary" href={item.currentVersion.url}>Link</Button>
                                    :
                                    <Button onClick={() => APIService.SendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import</Button>
                                }{' '}
                                {(item.author.username === user.username || isAdminUser()) && <Button onClick={() => editItem(item)} variant="secondary">Edit</Button>}{' '}
                                {(item.author.username === user.username || isAdminUser()) && <Button onClick={() => deleteItem(item)} variant="danger">Delete</Button>}{' '}
                                <Button onClick={() => window.open("https://join.slack.com/t/openspacesupport/shared_invite/zt-24uhn3wvo-gCGHgjg2m9tHzKUEb_FyMQ", "_blank")} variant="dark">Join on Slack</Button>


                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
                <Button
                    variant="primary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="primary"
                    className='mx-2'
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default ItemList;
