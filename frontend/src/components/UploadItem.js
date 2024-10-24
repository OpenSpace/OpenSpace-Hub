import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import APIService from './APIService';
import AlertMessages from './AlertMessages';

const UploadItem = ({ config }) => {
  const [showModal, setShowModal] = useState();

  const handleClose = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [itemType, setItemType] = useState('');

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

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError('');
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      validateItemName();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [name]);

  const validateItemName = async () => {
    const resp = await APIService.ValidateItemName(name);
    if (resp.error) {
      setName('');
      setNameError(resp.error);
      throw new Error(resp.error);
    }
    setName(name);
  };

  const [license, setLicense] = useState('');
  const handleLicenseChange = (e) => {
    setLicense(e);
  }

  const [video, setVideo] = useState('');
  const handleVideoChange = (e) => {
    setVideo(e.target.value);
  }

  const [openspaceVersion, setOpenspaceVersion] = useState('');
  const handleOpenSpaceVersionSelect = (e) => {
    setOpenspaceVersion(e);
  }

  const [itemTypes, setItemTypes] = useState([]);
  const [openspaceVersions, setOpenspaceVersions] = useState([]);
  const [licenseTypes, setLicenseTypes] = useState([]);
  useEffect(() => {
    setItemTypes(config.config.itemTypes);
    setItemType(config.config.itemTypes[0]);
    setOpenspaceVersions(config.config.versions);
    setOpenspaceVersion(config.config.versions[0]);
    setLicenseTypes(config.config.licenses);
    setLicense(config.config.licenses[0]);
  }, [config]);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const handleAcceptTerms = () => {
    setAcceptTerms(!acceptTerms);
  }

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!acceptTerms) {
      setShowError(true);
      setError('Please accept the terms and conditions.');
      return;
    }

    if (video != '') {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('name', name);
      formData.append('itemType', itemType.toLowerCase());
      formData.append('license', license);
      formData.append('description', description);
      formData.append('openspaceVersion', openspaceVersion);
      await APIService.UploadItem(formData)
        .then(resp => {
          if (resp.error) {
            throw new Error(resp.error);
          }
          setShowSuccess(true);
          setSuccess(resp.message);
          // alert(resp.message);
          // handleClose();
          // redirectToHome();
        })
        .catch(err => {
          setShowError(true);
          setError("Error uploading item. ", err.message);
          console.log(err);
        });
      return;
    }
    else {
      if (!file || name.trim() === '' || itemType.trim() === '' || license.trim() === '' || description.trim() === '') {
        setShowError(true);
        setError('Please fill in all fields.');
        return;
      }
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('image', image);
        formData.append('fileName', file.name);
        formData.append('name', name);
        formData.append('itemType', itemType.toLowerCase());
        formData.append('license', license);
        formData.append('openspaceVersion', openspaceVersion);
        formData.append('description', description);
        await APIService.UploadItem(formData)
          .then(resp => {
            if (resp.error) {
              throw new Error(resp.error);
            }
            setShowSuccess(true);
            setSuccess(resp.message);
            handleClose();
            // refreshHome();
          })
          .catch(err => {
            setShowError(true);
            setError("Error uploading item. " + err.message);
            console.log(err);
          });
        return;
      } else {
        setShowError(true);
        setError('Please select a valid file to upload.');
        return;
      }
    }
  }

  const redirectToHome = () => {
    //window.location.href = '/';
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
          <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>
            Warning: You are responsible for whatever is in it. Item can be modified by administrator if required.
          </p>
          {showError && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>
            Error: {error}.
          </p>}
          {showSuccess && <p style={{ color: 'green', fontWeight: 'bold', fontSize: '18px' }}>
            Success: {success}.
          </p>}
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <h5>Name</h5>
            <input type="text" value={name} onChange={handleNameChange} />
            {nameError && <p style={{ color: 'red' }}>{nameError}</p>}

            <h5 style={{ marginTop: '20px' }} >Description</h5>
            <textarea rows={3} value={description} onChange={handleDescription} />

            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
              <Dropdown onSelect={handleItemTypeSelect} >
                <h5>Item Type</h5>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {itemType.toUpperCase()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {itemTypes.map((type) => (
                    <Dropdown.Item key={type} eventKey={type}>{type.toUpperCase()}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
              <Dropdown onSelect={handleOpenSpaceVersionSelect} >
                <h5>OpenSpace Version <p style={{ fontSize: "15px" }}>(Make sure it runs on the selected version)</p></h5>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {openspaceVersion}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {openspaceVersions.map((version) => (
                    <Dropdown.Item key={version} eventKey={version}>{version}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Dropdown onSelect={handleLicenseChange} >
                <h5>License <p style={{ fontSize: "15px" }}></p></h5>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {license}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {licenseTypes.map((license) => (
                    <Dropdown.Item key={license} eventKey={license}>{license}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {(itemType.toLowerCase() === 'config' || itemType.toLowerCase() === 'video') ? null :
              (
                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                  <h5>Upload item-image <p style={{ fontSize: "15px" }}>(accepted formats: .jpg, .jpeg, .png)</p></h5>
                  <input id='imageInput' type="file" accept=".jpg, .jpeg, .png" onChange={handleImageChange} />
                </div>
              )
            }

            {itemType.toLowerCase() === 'asset' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip, .asset)</p></h5>
                <input id='fileInput' type="file" accept=".zip, .asset" onChange={handleFileChange} />
              </div>
            ) : itemType.toLowerCase() === 'profile' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .profile)</p></h5>
                <input id='fileInput' type="file" accept=".profile" onChange={handleFileChange} />
              </div>
            ) : itemType.toLowerCase() === 'recording' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .osrec, .osrectxt)</p></h5>
                <input id='fileInput' type="file" accept=".osrec, .osrectxt" onChange={handleFileChange} />
              </div>
            ) : itemType.toLowerCase() === 'webpanel' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip)</p></h5>
                <input id='fileInput' type="file" accept=".zip" onChange={handleFileChange} />
              </div>
            ) : itemType.toLowerCase() === 'video' ? (
              <>
                <h5> Video Link </h5>
                <input type="text" value={video} onChange={handleVideoChange} />
              </>
            ) : itemType.toLowerCase() === 'config' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .json)</p></h5>
                <input id='fileInput' type="file" accept=".json" onChange={handleFileChange} />
              </div>
            ) : itemType.toLowerCase() === 'package' ? (
              <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <h5>Upload a file <p style={{ fontSize: "15px" }}>(accepted formats: .zip)</p></h5>
                <input id='fileInput' type="file" accept=".zip" onChange={handleFileChange} />
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
            <label htmlFor="acceptTerms">I accept the <a href="#termsAndConditions">terms and conditions</a></label>
            <div id="termsAndConditions" style={{ maxHeight: '150px', overflowY: 'scroll', marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <h6>Terms and Conditions</h6>
              <p>1. You are solely responsible for the content you upload.</p>
              <p>2. Items can be modified or removed by administrators.</p>
              <p>3. Ensure all content is original or you have permission to upload.</p>
              <p>4. Do not upload offensive or illegal content.</p>
              <p>5. By uploading, you grant us the right to use, modify, and distribute your content.</p>
              <p>6. These terms may change at any time, and continued use implies acceptance.</p>
            </div>
          </div>
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
