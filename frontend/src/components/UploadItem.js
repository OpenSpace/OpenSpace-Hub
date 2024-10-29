import React, { useEffect } from 'react';
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import APIService from './APIService';

function UploadItem({ config }) {
  const [showModal, setShowModal] = useState();
  const [itemType, setItemType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [formValidated, setFormValidated] = useState(false);

  const handleItemTypeSelect = (e) => {
    setItemType(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError('');
  };

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
    setLicense(e.target.value);
  };

  const [video, setVideo] = useState('');
  const handleVideoChange = (e) => {
    setVideo(e.target.value);
  };

  const [openspaceVersion, setOpenspaceVersion] = useState('');
  const handleOpenSpaceVersionSelect = (e) => {
    setOpenspaceVersion(e.target.value);
  };

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
  };

  const handleUpload = async (event) => {
    const form = event.currentTarget;
    console.log(form);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setFormValidated(true);

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
        .then((resp) => {
          if (resp.error) {
            throw new Error(resp.error);
          }
          setShowSuccess(true);
          setSuccess(resp.message);
        })
        .catch((err) => {
          setShowError(true);
          setError('Error uploading item. ', err.message);
          console.log(err);
        });
      return;
    } else {
      if (
        !file ||
        name.trim() === '' ||
        itemType.trim() === '' ||
        license.trim() === '' ||
        description.trim() === ''
      ) {
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
          .then((resp) => {
            if (resp.error) {
              throw new Error(resp.error);
            }
            setShowSuccess(true);
            setSuccess(resp.message);
            handleClose();
            // refreshHome();
          })
          .catch((err) => {
            setShowError(true);
            setError('Error uploading item. ' + err.message);
            console.log(err);
          });
        return;
      } else {
        setShowError(true);
        setError('Please select a valid file to upload.');
        return;
      }
    }
  };

  function FormEntriesByAssetType(assetType) {
    if (!assetType) {
      return <></>;
    }
    const fileContent = {
      label: '',
      filesAccepted: '',
      showImageFilebrowser: true,
      description: '',
      overrideContent: false,
      content: <></>
    };

    switch (assetType) {
      case 'asset':
        fileContent.label = 'Upload an asset file';
        fileContent.filesAccepted = '.zip, .asset';
        fileContent.description = 'TODO asset description';
        break;
      case 'profile':
        fileContent.label = 'Upload a profile file';
        fileContent.filesAccepted = '.profile';
        fileContent.description =
          "TODO: long profile description: What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
        break;
      case 'recording':
        fileContent.label = 'Upload a recording file';
        fileContent.filesAccepted = '.osrec, .osrectxt';
        fileContent.description = 'TODO';
        break;
      case 'webpanel':
        fileContent.label = 'Upload a webpanel';
        fileContent.filesAccepted = '.zip';
        fileContent.description = 'TODO';
        break;
      case 'video':
        fileContent.showImageFilebrowser = false;
        fileContent.overrideContent = true;
        fileContent.description = 'TODO';
        fileContent.content = (
          <FloatingLabel controlId={'videoAssetUpload'} label={'Video link'}>
            <Form.Control
              type={'text'}
              value={video}
              onChange={handleVideoChange}
              placeholder={'Video name'}
              required
            />
            <Form.Control.Feedback>Enter a valid video url</Form.Control.Feedback>
          </FloatingLabel>
        );
        break;
      case 'config':
        fileContent.showImageFilebrowser = false;
        fileContent.label = 'Upload a config file';
        fileContent.filesAccepted = '.json';
        fileContent.description = 'TODO';
        break;
      case 'package':
        fileContent.label = 'Upload a package';
        fileContent.filesAccepted = '.zip';
        fileContent.description = 'TODO';
        break;
      default:
        console.error('Unhandled asset type', assetType);
        return <></>;
    }

    const uploadImageFileBrowser = (
      <Form.Group controlId={'assetImage'} className={'mb-3'}>
        <Form.Label className={'d-block mb-0'}>Upload asset image</Form.Label>
        <Form.Text className={'text-muted'}>
          accepted formats: .jpg, .jpeg, .png9
        </Form.Text>
        <Form.Control
          type={'file'}
          accept={'.jpg, .jpeg, .png'}
          onChange={handleImageChange}
        />
      </Form.Group>
    );

    const content = (
      <div className={'mb-3'}>
        <FloatingLabel
          controlId={'floatingAssetTypeDescription'}
          label={'Asset typ description'}
          className={'mb-3'}
        >
          <Form.Control
            as={'textarea'}
            value={fileContent.description}
            aria-label={'Asset type description'}
            readOnly
            style={{ height: 100 }}
          />
        </FloatingLabel>
        {fileContent.showImageFilebrowser && uploadImageFileBrowser}
        {fileContent.overrideContent ? (
          fileContent.content
        ) : (
          <Form.Group controlId={'fileInput'}>
            <Form.Label className={'d-block mb-0'}>{fileContent.label} </Form.Label>
            <Form.Text className={'text-muted'}>
              accepted formats: {fileContent.filesAccepted}
            </Form.Text>
            <Form.Control
              type={'file'}
              accept={fileContent.filesAccepted}
              onChange={handleFileChange}
              required
            />
            <Form.Control.Feedback type={'invalid'}>Missing file</Form.Control.Feedback>
          </Form.Group>
        )}
      </div>
    );

    return content;
  }

  return (
    <>
      <Button onClick={handleShowModal} variant="dark">
        Upload an Item
      </Button>

      <Modal show={showModal} onHide={handleClose} size={'xl'}>
        <Modal.Header closeButton>
          <Modal.Title>Upload an Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
            Warning: You are responsible for whatever is in it. Item can be modified by
            administrator if required.
          </p>
          {showError && (
            <p style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
              Error: {error}.
            </p>
          )}
          {showSuccess && (
            <p style={{ color: 'green', fontWeight: 'bold', fontSize: 18 }}>
              Success: {success}.
            </p>
          )}
          <Form noValidate validated={formValidated} onSubmit={handleUpload}>
            <FloatingLabel
              controlId={'floatingAssetName'}
              label={'Asset name'}
              className={'mb-3'}
            >
              <Form.Control
                type={'text'}
                value={name}
                onChange={handleNameChange}
                placeholder={'Asset name'}
                required
              />
              <Form.Control.Feedback type={'invalid'}>
                Asset name is required
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId={'floatingDescription'}
              label={'Asset description'}
              className={'mb-3'}
            >
              <Form.Control
                as={'textarea'}
                value={description}
                onChange={handleDescription}
                placeholder={'Description'}
                rows={5}
                style={{ height: 125 }}
              />
            </FloatingLabel>
            <Row className={'mb-3'}>
              <Col>
                <FloatingLabel
                  controlId={'floatingSelectType'}
                  label={'Select asset type'}
                >
                  <Form.Select value={itemType} onChange={handleItemTypeSelect}>
                    {itemTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId={'floatingOpenSpaceVersion'}
                  label={'Select OpenSpace version'}
                >
                  <Form.Select
                    value={openspaceVersion}
                    onChange={handleOpenSpaceVersionSelect}
                  >
                    {openspaceVersions.map((version) => (
                      <option key={version}>{version}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col>
                <FloatingLabel controlId={'floatingLicense'} label={'Select license'}>
                  <Form.Select value={license} onChange={handleLicenseChange}>
                    {licenseTypes.map((license) => (
                      <option key={license}>{license}</option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            {FormEntriesByAssetType(itemType)}
            <Form.Group controlId={'termsAndConditions'} className={'mb-3'}>
              <Form.Check type={'checkbox'}>
                <Form.Check.Input
                  type={'checkbox'}
                  checked={acceptTerms}
                  onChange={handleAcceptTerms}
                  required
                />
                <Form.Check.Label>
                  I accept the <a href={'#termsAndConditions'}> terms and conditions</a>
                </Form.Check.Label>
                <Form.Control.Feedback type={'invalid'}>
                  You must agree before submitting
                </Form.Control.Feedback>
              </Form.Check>
            </Form.Group>
          </Form>
          <div
            id="termsAndConditions"
            style={{
              maxHeight: 190,
              overflowY: 'scroll',
              border: '1px solid #ccc'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Terms and Conditions</span>
            <ol>
              <li>You are solely responsible for the content you upload.</li>
              <li>Items can be modified or removed by administrators.</li>
              <li>Ensure all content is original or you have permission to upload.</li>
              <li>Do not upload offensive or illegal content.</li>
              <li>
                By uploading, you grant us the right to use, modify, and distribute your
                content.
              </li>
              <li>
                These terms may change at any time, and continued use implies acceptance.
              </li>
            </ol>
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
