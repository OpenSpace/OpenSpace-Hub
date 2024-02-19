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

    return (
        <div className="pt-3 px-4">
            <div className="text-center fw-bold fs-4">
                <u>Assets</u>
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
                                <Card.Text>
                                    <b>Current Version: </b>
                                    <Card.Link href={item.currentVersion.url}>{item.currentVersion.version}</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>Other Versions: </b>
                                    {item.archives.map(version => (
                                        <Card.Link key={version.version} href={version.url}>{version.version}</Card.Link>
                                    ))}
                                </Card.Text>
                                <Card.Text>
                                    <b>Last Update: </b> {item.modified}
                                </Card.Text>
                                <Button variant="primary">Import Asset</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}


export default Body;