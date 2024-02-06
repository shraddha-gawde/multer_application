const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require("cors");

const app = express();
const port = 8080;
app.use(cors())

app.use(express.static('public')); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage:multer.memoryStorage()});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.get('/image/:key', (req, res) => {
  const key = req.params.key;

  // Generate a pre-signed URL for the image
  const params = {
    Bucket: "cyclic-rich-gray-coypu-kit-eu-west-3",
    Key: key,
    Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generating pre-signed URL');
    }
    res.setHeader('Content-Disposition', 'inline');
    // Redirect the client to the pre-signed URL
    res.send(url);
  });
});


app.put('/image/:filename', upload.single('file'), async (req, res) => {
let filename = req.params.filename;

if (!req.file) {
  res.status(400).send('No file uploaded').end();
  return;
}

try {

    await s3.putObject({
  Body: req.file.buffer,
  Bucket: "cyclic-rich-gray-coypu-kit-eu-west-3",
  Key: filename,
}).promise()

res.set('Content-type', 'multipart/form-data')
res.send('ok').end()
} catch (error) {
  console.log(error);
  res.sendStatus(500).end();
}
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
