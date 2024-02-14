// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Body = () => (
    // <Card style={{ width: '30rem' }}>
    //   <Card.Img variant="top" src="https://raw.githubusercontent.com/OpenSpaceHub/misc/master/extragalactic/screenshot.png" />
    //   <Card.Body>
    //     <Card.Title>Extragalactic</Card.Title>
    //     <Card.Text>
    //         Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys. Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.Extragalactic data sets for GAMA and Parkes-H1 Zone of Avoidance (HIZOA) surveys.
    //     </Card.Text>
    //     <Card.Text>
    //         <b>Author:</b> Abhay Garg
    //     </Card.Text>
    //     <Button variant="primary">Go somewhere</Button>
    //   </Card.Body>
    // </Card>
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
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    </div>
)
export default Body;