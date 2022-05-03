import React, { useState, useRef, Fragment } from 'react';
import { PacmanLoader as Loader } from 'react-spinners';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Chat from './Chat';
import './CodeEditor.css';
import Users from './Users';

const CodeEditor = ({ socket }) => {
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('py');
  const [code, setCode] = useState('');
  const [chatScale, setChatScale] = useState(0);
  const [usersScale, setUsersScale] = useState(0);
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const editCode = (e) => {
    let text = editorRef.current.getValue();
    socket.emit('edit', text);
  };

  const displayCode = (message) => {
    setCode(message);
  };

  socket.on('editCode', (msg) => {
    displayCode(msg);
  });

  const handleSubmit = async () => {
    const payload = {
      language,
      code: editorRef.current.getValue(),
    };
    try {
      const { data } = await axios.post('http://localhost:5000/run', payload);
      setOutput(data.output);
    } catch ({ response }) {
      if (response) {
        const err = response.data.err.stderr;
        let arr = err.split(',');
        let errMsg = arr.slice(1, arr.length).join(',');
        setOutput(errMsg);
      } else {
        setOutput('Error connecting to server!');
      }
    }
  };

  const toggleChat = (e) => {
    if (chatScale === 0) {
      setUsersScale(0);
      setChatScale(1);
    } else {
      setChatScale(0);
    }
  };

  const toggleUsers = (e) => {
    if (usersScale === 0) {
      setChatScale(0);
      setUsersScale(1);
    } else {
      setUsersScale(0);
    }
  };

  return (
    <Fragment className='editor-fragment flex-center flex-col'>
      <header className='header'>
        <nav className='navbar flex-center justify-start'>
          <button
            className='btn animated-btn run flex-center'
            onClick={handleSubmit}
          >
            <span>Run</span> <i className='fa-solid fa-caret-right'></i>
          </button>
          <p className='h6'>Select a language:</p>
          <div className='options flex-center'>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value='cpp'>cpp</option>
              <option value='py'>python</option>
            </select>
            <div className='custom-arrow'></div>
          </div>
          <div className='logo'>
            <img
              src='https://dewey.tailorbrands.com/production/brand_version_mockup_image/337/6826135337_4bbbc1c9-9e27-416f-9f37-05fcf5336322.png?cb=1644950579'
              alt='logo'
            />
          </div>
        </nav>
      </header>
      <main>
        <section className='editor-container flex-center flex-col'>
          <Editor
            className='editor'
            height='calc(100vh - 20rem)'
            width='100%'
            defaultLanguage={language === 'py' ? 'python' : 'cpp'}
            theme='vs-dark'
            value={code}
            loading={<Loader />}
            onMount={handleEditorDidMount}
            onChange={editCode}
          />
          <div className='output-container'>
            <p className='h4'>Output:</p>
            <p className='output'>{output}</p>
          </div>
        </section>
      </main>
      <footer className='footer flex-center'>
        <div className='flex-center'>
          <i class='fa-solid fa-users' onClick={toggleUsers}></i>
          <i class='fa-brands fa-rocketchat' onClick={toggleChat}></i>
        </div>
      </footer>
      <Chat socket={socket} chatScale={chatScale} />
      <Users socket={socket} usersScale={usersScale} />
    </Fragment>
  );
};

export default CodeEditor;
