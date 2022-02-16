import { useState, useRef, useEffect } from 'react'

import Editor from "@monaco-editor/react";
import axios from 'axios'
import './App.css';

const App = () => {
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [language, setLanguage] = useState("py")
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const handleSubmit = async () => {
    const payload = {
      language,
      code: editorRef.current.getValue()
    }
    try {
      const { data } = await axios.post("http://localhost:5000/run", payload)
      setOutput(data.output);
    } catch ({ response }) {
      if (response) {
        const err = response.data.err.stderr
        let arr = err.split(',');
        let errMsg = arr.slice(1, arr.length).join(',');
        setOutput(errMsg);
      } else {
        setOutput("Error connecting to server!")
      }
    }
  }

  return (
    <div className="app">
      <header className="header">
        <section className="header__tools">
          <button onClick={handleSubmit}><span>Run</span><i class="fa-solid fa-caret-right"></i> </button>
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
        </section>
        <div className="logo">
          <img src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/337/6826135337_4bbbc1c9-9e27-416f-9f37-05fcf5336322.png?cb=1644950579" alt="logo" />
        </div>
      </header>
      <main>
        <section className="editor__container">
          <Editor
            className="editor"
            height="60vh"
            width="100%"
            defaultLanguage={language === "py" ? "python" : "cpp"}
            theme="vs-dark"
            defaultValue='print("Hello World")'
            onMount={handleEditorDidMount}
          />
          <div className="output-container">
            <h3>output</h3>
            <p>{output}</p>
          </div>
        </section>
      </main>
    </div >
  );
}

export default App;
