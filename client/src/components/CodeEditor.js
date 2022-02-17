import React, { useState, useRef, Fragment } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import Chat from './Chat';

const CodeEditor = ({ socket }) => {
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("py");
  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const editCode = (e) => {
    let text = editorRef.current.getValue();
    socket.emit('edit', text);
  }

  const displayCode = (message) => {
    setCode(message);
  }

  socket.on('editCode', msg => {
    displayCode(msg);
  });

  const handleSubmit = async () => {
    const payload = {
      language,
      code: editorRef.current.getValue()
    }
    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setOutput(data.output);
    } catch ({ response }) {
      if (response) {
        const err = response.data.err.stderr;
        let arr = err.split(',');
        let errMsg = arr.slice(1, arr.length).join(',');
        setOutput(errMsg);
      } else {
        setOutput("Error connecting to server!");
      }
    }
  }

  return (
    <Fragment>
      <header className="header">
        <nav className="navbar">
          <button className='btn run' onClick={handleSubmit}><span>Run</span><i className="fa-solid fa-caret-right"></i> </button>
          <div className="option">
            {/* <label>Select language: </label> */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="cpp">cpp</option>
              <option value="py">python</option>
            </select>
          </div>
        </nav>
      </header>
      <main>
        <section className="editor__container">
          <Editor
            className="editor"
            height="60vh"
            width="100%"
            defaultLanguage={language === "py" ? "python" : "cpp"}
            theme="vs-dark"
            value={code}
            onMount={handleEditorDidMount}
            onChange={editCode}
          />
          <div className="output-container">
            <h3>output</h3>
            <p>{output}</p>
          </div>
        </section>
      </main>
      <Chat socket={socket} />
    </Fragment>
  )
}

export default CodeEditor;