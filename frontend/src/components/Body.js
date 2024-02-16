// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const Body = () => (
    <div className="pt-3 px-4">
        <div className="text-center fw-bold fs-4">
            <u>Assets</u>
        </div>
        <div className="pt-3 px-4">
            <Row xs={1} md={3} className="g-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <Col key={idx}>
                        <Card>
                            <Card.Img variant="top" src="https://raw.githubusercontent.com/OpenSpaceHub/misc/master/extragalactic/screenshot.png" />
                            <Card.Body>
                                <Card.Title>Extragalactic</Card.Title>
                                <Card.Text>
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                    Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
                                </Card.Text>
                                <Card.Text>
                                    <b>Author: </b>
                                    <Card.Link href="https://www.calacademy.org/exhibits/morrison-planetarium">Morrison Planetarium/Dan Tell</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>Current Version: </b>
                                    <Card.Link href="https://github.com/OpenSpaceHub/misc/raw/master/extragalactic/extragalactic.zip">0.19.0</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>Other Versions: </b>
                                    <Card.Link href="https://github.com/OpenSpaceHub/misc/raw/master/extragalactic/extragalactic_0180.zip">0.18.0</Card.Link>
                                    <Card.Link href="https://github.com/OpenSpaceHub/misc/raw/master/extragalactic/extragalactic_0_16_0.zip">0.16.0</Card.Link>
                                </Card.Text>
                                <Card.Text>
                                    <b>Last Update: </b> 2021-09-01
                                </Card.Text>
                                <Button variant="primary">Import Asset</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    </div>
)
export default Body;