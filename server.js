const express = require('express');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;

const app = express();

app.use(fileUpload());

//upload endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) return res.status(400).json({ message: 'No File was uploaded' });
  const file = req.files.file;

  file.mv(`${__dirname}/client/public/upload/${file.name}`, err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/upload/${file.name}` });
  });
})

app.listen(port, () => console.log('Server started...'))

//