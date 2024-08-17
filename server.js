require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// File Upload Setup
const upload = multer({ dest: 'uploads/' });

// Route: Upload Profile Picture
app.post('/upload', upload.single('profilePicture'), (req, res) => {
  const file = req.file;
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `profiles/${file.filename}${path.extname(file.originalname)}`,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Save file URL and user data to the database
    const { userId, userName } = req.body;
    const sql = 'INSERT INTO users (id, name, profile_picture_url) VALUES (?, ?, ?)';
    const values = [userId, userName, data.Location];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.status(200).send(`File uploaded successfully. ${data.Location}`);
    });
  });
});

// Route: Get User Information
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
