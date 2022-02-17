import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from "socket.io-client";
import CodeEditor from './components/CodeEditor';
import Home from './components/Home';

const socket = io.connect('/');

const App = () => {

  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' element={ <Home socket={socket} /> } />
          <Route path="code-editor/:roomname/:username" element={ <CodeEditor socket={socket} /> } />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
