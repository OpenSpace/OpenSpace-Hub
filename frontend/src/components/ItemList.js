import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import APIService from './APIService';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

function ItemList({
  user,
  type,
  config,
  filterByUsername = false,
  setRedAlertMessage,
  setGreenAlertMessage
}) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tnCError, setTnCError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openspaceVersion, setOpenspaceVersion] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openspaceVersions = config?.config?.versions ?? [];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadItems();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  function handleClose() {
    setShowModal(false);
    setSelectedItem(null);
    setTnCError('');
  }

  function handleNameChange(e) {
    setSelectedItem({ ...selectedItem, name: e.target.value });
  }
  function handleDescription(e) {
    setSelectedItem({ ...selectedItem, description: e.target.value });
  }

  function handleOpenSpaceVersionSelect(e) {
    setOpenspaceVersion(e);
    setSelectedItem({ ...selectedItem, openspaceVersion: e });
  }

  async function loadItems() {
    try {
      let username = '';
      if (filterByUsername) {
        username = user.username;
      }
      const resp = await APIService.GetItems({
        type,
        search: searchTerm,
        page: currentPage,
        username: username
      });
      setItems(resp.items);
      setTotalPages(Math.ceil(resp.total / resp.limit));
    } catch (error) {
      console.log(`Error loading items: `, error);
      setRedAlertMessage(`Error loading items: ${error.message}`);
    }
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleImageChange(e) {
    setSelectedItem({ ...selectedItem, image: e.target.files[0] });
  }

  function handleFileChange(e) {
    setSelectedItem({ ...selectedItem, file: e.target.files[0] });
  }

  function handleVideoChange(e) {
    setSelectedItem({ ...selectedItem, video: e.target.value });
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function isAdminUser() {
    return user.role === 'admin';
  }

  async function deleteItem(item) {
    const confirmation = window.confirm('Are you sure you want to delete this item?');
    if (!confirmation) {
      return;
    }

    try {
      const resp = await APIService.DeleteItem(item._id);
      if (resp.error) {
        throw new Error(resp.error);
      }
      setItems(items.filter((i) => i._id !== item._id));
      setGreenAlertMessage('Item deleted successfully');
    } catch (error) {
      console.log(error);
      setRedAlertMessage(`Error deleting item: ${error.message}`);
    }
  }

  function sendImportToOpenSpace(url, type) {
    return async () => {
      const openspace = window.openspace;
      if (!openspace) {
        setRedAlertMessage('Connect to OpenSpace first');
        return;
      }
      try {
        await APIService.SendImportToOpenSpaceCommand(url, type);
        setGreenAlertMessage('Item imported successfully');
      } catch (error) {
        console.log(error);
        setRedAlertMessage(`Error importing item: ${error.message}`);
      }
    };
  }

  function editItem(item) {
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description);
    setOpenspaceVersion(item.openspaceVersion);
    setShowModal(true);
  }

  function handleAcceptTerms() {
    setAcceptTerms(!acceptTerms);
  }

  async function handleModalSave(event) {
    event.preventDefault();
    if (!acceptTerms) {
      setTnCError('Please accept the terms and conditions.');
      return;
    } else {
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
        .then((resp) => {
          if (resp.error) {
            throw new Error(resp.error);
          }
          setGreenAlertMessage('Item updated successfully');
          setItems(items.map((i) => (i._id === selectedItem._id ? resp.item : i)));
          handleClose();
        })
        .catch((err) => {
          setRedAlertMessage(`Error updating item. ${err.message}`);
          console.log(err);
        });
      return;
    }
  }

  function handleModalCancel() {
    setShowModal(false);
    setSelectedItem(null);
    setTnCError('');
  }

  function getHeaderPageName(type) {
    switch (type) {
      case 'asset':
        return 'Assets';
      case 'profile':
        return 'Profiles';
      case 'webpanel':
        return 'Web Panels';
      case 'config':
        return 'Configs';
      case 'video':
        return 'Videos';
      case 'package':
        return 'Packages';
      default:
        return 'Hub Items';
    }
  }

  return (
    <div className="pt-3 px-4">
      {/*TODO fix this */}
      <div className="text-center fw-bold fs-4">
        <h1>{getHeaderPageName(type)}</h1>
      </div>
      {/* <AlertMessages
              redAlertMessage={redAlertMessage}
              greenAlertMessage={greenAlertMessage}
              clearRedAlertMessage={() => setRedAlertMessage('')}
              clearGreenAlertMessage={() => setGreenAlertMessage('')}
        /> */}
      {/* <div className="mt-3">
              {redAlertMessage && (
                <Alert variant="danger">
                  {redAlertMessage}
                </Alert>
              )}
              {greenAlertMessage && (
                <Alert variant="success">
                  {greenAlertMessage}
                </Alert>
              )}
            </div> */}
      {/*TODO: rewrite this modal so that its design matches the UploadItems.js,
       perhaps also to its own component?*/}
      <Modal show={showModal} onHide={handleModalCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <h5>Name</h5>
            <input
              type="text"
              defaultValue={selectedItem?.name}
              onChange={handleNameChange}
            />
            <h5 style={{ marginTop: '20px' }}>Description</h5>
            <textarea
              rows={3}
              defaultValue={selectedItem?.description}
              onChange={handleDescription}
            />
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
              <Dropdown onSelect={handleOpenSpaceVersionSelect}>
                <h5>
                  OpenSpace Version{' '}
                  <p style={{ fontSize: '15px' }}>
                    (Make sure it runs on the selected version)
                  </p>
                </h5>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedItem
                    ? selectedItem.openspaceVersion
                      ? openspaceVersion
                      : 'Select version'
                    : null}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {openspaceVersions.map((version) => (
                    <Dropdown.Item key={version} eventKey={version}>
                      {version}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {selectedItem?.type === 'config' || selectedItem?.type === 'video' ? null : (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload item-image{' '}
                  <p style={{ fontSize: '15px' }}>
                    (accepted formats: .jpg, .jpeg, .png)
                  </p>
                </h5>
                <input
                  id="imageInput"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}
                />
              </div>
            )}

            {selectedItem?.type === 'asset' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .zip, .asset)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".zip, .asset"
                  onChange={handleFileChange}
                />
              </div>
            ) : selectedItem?.type === 'profile' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .profile)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".profile"
                  onChange={handleFileChange}
                />
              </div>
            ) : selectedItem?.type === 'recording' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>
                    (accepted formats: .osrec, .osrectxt)
                  </p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".osrec, .osrectxt"
                  onChange={handleFileChange}
                />
              </div>
            ) : selectedItem?.type === 'webpanel' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .zip)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                />
              </div>
            ) : selectedItem?.type === 'video' ? (
              <>
                <h5>Video Link</h5>
                <input type="text" onChange={handleVideoChange} />
              </>
            ) : selectedItem?.type === 'config' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .json)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
            ) : selectedItem?.type === 'package' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .zip, .asset)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".zip, .asset"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>
                  Upload a file{' '}
                  <p style={{ fontSize: '15px' }}>(accepted formats: .zip, .asset)</p>
                </h5>
                <input
                  id="fileInput"
                  type="file"
                  accept=".zip, .asset"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </form>
          <div style={{ marginBottom: '20px', marginTop: '20px' }}>
            <input type="checkbox" checked={acceptTerms} onChange={handleAcceptTerms} />
            <label htmlFor="acceptTerms">I accept the terms and conditions</label>
            {tnCError && <p style={{ color: 'red' }}>{tnCError}</p>}
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
      <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={6} className="g-3">
        {items.map((item) => (
          <Col key={item.id}>
            <Card style={{ height: 750, overflowY: 'scroll' }}>
              {item.image && item.image !== 'no-image' && (
                <Card.Img
                  variant={'top'}
                  src={item.image}
                  style={{ width: '100%', height: 350, objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title as={'h3'} style={{ fontWeight: 'bold' }}>
                  {item.name}
                </Card.Title>
                <hr style={{ marginTop: 0, marginBottom: '0.5rem' }} />
                <Card.Text style={{ height: 80, overflowY: 'scroll' }}>
                  {item.description}
                </Card.Text>
                <Card.Text style={{ margin: 0 }}>
                  <b>Type: </b>
                  {item.type}
                </Card.Text>
                <Card.Text style={{ margin: 0 }}>
                  <b>Author: </b>
                  <Card.Link href={item.author.link}>{item.author.name}</Card.Link>
                </Card.Text>
                <Card.Text style={{ margin: 0 }}>
                  <b>License: </b>
                  {item.license}
                </Card.Text>
                <Card.Text style={{ margin: 0 }}>
                  <b>OpenSpace Version: </b>
                  {item.openspaceVersion}
                </Card.Text>
                {item.currentVersion && (
                  <Card.Text style={{ margin: 0 }}>
                    <b>Current Version: {item.currentVersion.version} </b>
                    <Card.Link href={item.currentVersion.url}>Download</Card.Link>
                  </Card.Text>
                )}
                {item.archives && item.archives.length > 0 && (
                  <Card.Text style={{ margin: 0 }}>
                    <b>Other Versions: </b>
                    {item.archives.map((version) => (
                      <Card.Link key={version.version} href={version.url}>
                        {version.version}
                      </Card.Link>
                    ))}
                  </Card.Text>
                )}
                <Card.Text>
                  <b>Last Update: </b> {item.modified}
                </Card.Text>
                {item.type === 'video' ? (
                  <Button variant="secondary" href={item.currentVersion.url}>
                    Link
                  </Button>
                ) : (
                  <Button
                    onClick={sendImportToOpenSpace(item.currentVersion.url, item.type)}
                    variant="secondary"
                  >
                    Import
                  </Button>
                )}{' '}
                {(item.author.username === user.username || isAdminUser()) && (
                  <Button onClick={() => editItem(item)} variant="secondary">
                    Edit
                  </Button>
                )}{' '}
                {(item.author.username === user.username || isAdminUser()) && (
                  <Button onClick={() => deleteItem(item)} variant="danger">
                    Delete
                  </Button>
                )}{' '}
                {/* <Button
                  onClick={() =>
                    window.open(
                      'https://join.slack.com/t/openspacesupport/shared_invite/zt-24uhn3wvo-gCGHgjg2m9tHzKUEb_FyMQ',
                      '_blank'
                    )
                  }
                  variant="dark"
                >
                  Join on Slack
                </Button> */}
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
          className="mx-2"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ItemList;
