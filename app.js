require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const kamarRoutes = require('./routes/KamarRoutes');
const gedungRoutes = require('./routes/GedungRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware global ----------
app.use(logger);

// A2. CORS: hanya mengizinkan origin dari process.env.CORS_ORIGIN, dengan method GET dan POST
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST']
}));

app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.json({
    topik: 'Manajemen Kamar dan Gedung',
    daftar_endpoint: [
      'GET /kamar',
      'GET /kamar/:id',
      'POST /kamar',
      'GET /gedung',
      'GET /gedung/:id',
      'POST /gedung'
    ]
  });
});

// ---------- Route per modul ----------
app.use('/kamar', kamarRoutes);
app.use('/gedung', gedungRoutes);

// Route untuk mensimulasikan error tak terduga (A3)
app.get('/error-uji', () => {
  throw new Error('Kesalahan tak terduga untuk pengujian');
});

// A3. Error handling didaftarkan paling akhir
app.use(notFoundHandler);
app.use(errorHandler);

// B1. Koneksi ke MongoDB dengan process.env.MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI tidak ditemukan di .env! Silakan isi MONGODB_URI terlebih dahulu.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung:', err.message);
    process.exit(1);
  });

module.exports = app;
