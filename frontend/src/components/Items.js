// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React from 'react';
import APIService from './APIService';
import { useEffect, useState } from 'react';

function Body() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        APIService.GetAllItems()
            .then(resp => {
                setItems(resp);
            })
            .catch(error => console.log(error))
    }, [])

    const sendImportToOpenSpaceCommand = async(url, type) => {
        var openspace = window.openspace;
        var fileName = url.substr(url.lastIndexOf('/') + 1);
        switch (type) {
            case 'asset':
                var absPath = await openspace.absPath('${TEMPORARY}/' + fileName)
                var pathString = '${USER_ASSETS}/';
                var scenePath = await openspace.absPath(pathString)
                await openspace.downloadFile(url, absPath["1"], true);
                await openspace.unzipFile(absPath["1"], scenePath["1"], true);
                var noextension = fileName.substr(0, fileName.indexOf('.'));
                await openspace.asset.add(scenePath["1"] + noextension + "/" + noextension);
                await openspace.setPropertyValueSingle("Modules.CefWebGui.Reload", null)
                break;
            case 'profile':
                var absPath = await openspace.absPath('${USER_PROFILES}/' + fileName);
                await openspace.downloadFile(url, absPath["1"], true);
                alert("Profile imported successfully");
                break;
            case 'recording':
                var absPath = await openspace.absPath('${RECORDINGS}/' + fileName);
                await openspace.downloadFile(url, absPath["1"], true);
                alert("Profile downloaded successfully");
                break;
            default:
                console.log('nothing to do')
                break;
        }
    }


    return (
        <div className="pt-3 px-4">
            <div className="text-center fw-bold fs-4">
                <u>Hub Items</u>
            </div>
            <div className="pt-3 px-4"></div>
            <Row xs={1} md={3} className="g-4">
                {items.map(item => (
                    <Col key={item.id}>
                        <Card>
                            <Card.Img variant="top" src={item.image} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    {item.description}
                                </Card.Text>
                                <Card.Text>
                                    <b>Author: </b>
                                    <Card.Link href={item.author.link}>{item.author.name}</Card.Link>
                                </Card.Text>
                                {item.currentVersion &&
                                    <Card.Text>
                                        <b>Current Version: </b>
                                        <Card.Link href={item.currentVersion.url}>{item.currentVersion.version}</Card.Link>
                                    </Card.Text>
                                }
                                {item.archives &&
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
                                {/* item.currentVersion.url */}
                                {item.type === "asset" && <Button onClick={() => sendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Asset</Button>}
                                {item.type === "profile" && <Button onClick={() => sendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Profile</Button>}
                                {item.type === "recording" && <Button onClick={() => sendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Recording</Button>}
                                {item.type === "videos" && <Button variant="primary" href={item.link}>Link</Button>}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}


export default Body;