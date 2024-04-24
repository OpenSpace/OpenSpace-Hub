// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React from 'react';
import APIService from './APIService';
import { useEffect, useState } from 'react';
import EditItem from './EditItem';

function UserItems({ user }) {
    const [items, setItems] = useState([]);
    const [showEditItem, setShowEditItem] = useState(false);
    useEffect(() => {
        if (user) {
            APIService.GetUserItems(user.username)
                .then(resp => {
                    setItems(resp);
                })
                .catch(error => console.log(error))
        }
    }, [user])

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
        console.log(item);
        setShowEditItem(true);
        console.log(showEditItem);
        alert(showEditItem)
        return (
            <div>
                {showEditItem && <EditItem item={item} editModal={showEditItem} />}
            </div>
        )
    }

    return (
        <div className="pt-3 px-4">
            <div className="text-center fw-bold fs-4">
                <u>Your Hub Items</u>
            </div>
            <div className="pt-3 px-4"></div>
            <Row xs={1} md={3} className="g-4">
                {items.map(item => (
                    <Col key={item.id}>
                        <Card>
                            {item.image && item.image != 'no-image' &&
                                <Card.Img variant="top" src={item.image} />
                            }
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    {item.description}
                                </Card.Text>
                                <Card.Text>
                                    <b>Author: </b>
                                    <Card.Link href={item.author.link}>{item.author.name}</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>License: </b>
                                    {item.license}
                                </Card.Text>
                                {item.currentVersion &&
                                    <Card.Text>
                                        <b>Current Version: </b>
                                        <Card.Link href={item.currentVersion.url}>{item.currentVersion.version}</Card.Link>
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
                                {/* item.currentVersion.url */}
                                {item.type === "asset" && <Button onClick={() => APIService.SendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Asset</Button>}{' '}
                                {item.type === "profile" && <Button onClick={() => APIService.SendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Profile</Button>}{' '}
                                {item.type === "recording" && <Button onClick={() => APIService.SendImportToOpenSpaceCommand(item.currentVersion.url, item.type)} variant="primary">Import Recording</Button>}{' '}
                                {item.type === "video" && <Button variant="primary" href={item.currentVersion.url}>Link</Button>}{' '}
                                {item.author.username === user.username && <Button onClick={() => editItem(item)} variant="secondary">Edit</Button>}{' '}
                                {/* {alert(showEditItem) && alert(item.name) && <EditItem item={item} editModal={showEditItem} />} */}
                                {item.author.username === user.username && <Button onClick={() => deleteItem(item)} variant="danger">Delete</Button>}{' '}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}


export default UserItems;