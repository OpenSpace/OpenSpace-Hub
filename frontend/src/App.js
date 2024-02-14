// import { Button, Stack, Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Body from './components/Body';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div>
      <NavBar/>
      <Body/>
      <Footer/>
    </div>
    // <Container className="p-3">
    //   <Stack direction="horizontal" gap={2}>
    //     <Button as="a" variant="primary">
    //       Button as link
    //     </Button>
    //   </Stack>
    // </Container>
  );
}

export default App;
