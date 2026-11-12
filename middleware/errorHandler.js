function notFoundHandler(req, res) {
  res.status(404).json({ message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan` });
}

function errorHandler(err, req, res, next) {
  // Body JSON rusak
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  // ID bukan ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Format ID tidak valid' });
  }

  // Pelanggaran Schema (ValidationError)
  if (err.name === 'ValidationError') {
    const detail = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Data tidak valid',
      detail
    });
  }

  // Nilai unik bentrok (MongoDB duplicate key error code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return res.status(409).json({ message: `${field} sudah digunakan, gunakan nilai lain` });
  }

  // Galat yang dilempar sengaja (misalnya err.status atau err.statusCode)
  const status = err.status || err.statusCode;
  if (status && status !== 500) {
    return res.status(status).json({ message: err.message });
  }

  // Galat lain yang tidak terduga (500) tanpa stack trace
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

module.exports = { notFoundHandler, errorHandler };
