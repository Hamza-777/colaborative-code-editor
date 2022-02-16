const express = require("express");
const cors = require('cors')
const { generateFile } = require('./generateFile')
const { executeCpp } = require('./executeCpp')
const { executePy } = require('./executePy')
const app = express();

app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  return res.json({ hello: "bitches" })
})

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body
  // console.log(language);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body" })
  }
  try {
    // need to generate cpp file with content from the request
    const filepath = await generateFile(language, code)

    //run the file and send the response
    let output
    if (language === "cpp") {
      output = await executeCpp(filepath)
    } else {
      output = await executePy(filepath)
    }

    return res.json({ filepath, output })
  } catch (err) {
    res.status(500).json({ err })
  }
})

app.listen(5000, () => {
  console.log("Listening on port: 5000");
})