const Kamar = require('../models/KamarModels');

exports.create = async (req, res, next) => {
  try {
    // C1: Hanya field dari tabel topik yang diterima dari body; field lain diabaikan
    const { nomorKamar, namaKamar, hargaPerMalam, status, fasilitas, gedungId } = req.body;
    const baru = await Kamar.create({
      nomorKamar,
      namaKamar,
      hargaPerMalam,
      status,
      fasilitas,
      gedungId
    });
    res.status(201).json(baru);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};

    // C3: Filter dengan query parameter
    // Hanya data yang nilai [filter]-nya sama persis yang ditampilkan
    if (req.query.status !== undefined) {
      filter.status = req.query.status;
    }
    if (req.query.nomorKamar !== undefined) {
      filter.nomorKamar = req.query.nomorKamar;
    }
    if (req.query.namaKamar !== undefined) {
      filter.namaKamar = req.query.namaKamar;
    }

    let query = Kamar.find(filter);

    // C3: Sorting jika parameter sort dikirim, diurutkan menaik (1)
    if (req.query.sort) {
      query = query.sort({ [req.query.sort]: 1 });
    }

    const data = await query.exec();
    // C2 & C3: Array berisi data
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    // C4: [ref] di-populate (memuat kode dan nama). ID tidak ada: 404. ID salah format: 400 (otomatis lewat CastError di errorHandler)
    const data = await Kamar.findById(req.params.id).populate('gedungId', 'kode nama');
    if (!data) {
      const err = new Error(`Kamar dengan id ${req.params.id} tidak ditemukan`);
      err.status = 404;
      return next(err);
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const allowedFields = ['nomorKamar', 'namaKamar', 'hargaPerMalam', 'status', 'fasilitas', 'gedungId'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => allowedFields.includes(field))
    );

    const data = await Kamar.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: 'after', runValidators: true }
    ).populate('gedungId', 'kode nama');

    if (!data) {
      const err = new Error(`Kamar dengan id ${req.params.id} tidak ditemukan`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await Kamar.findByIdAndDelete(req.params.id);
    if (!data) {
      const err = new Error(`Kamar dengan id ${req.params.id} tidak ditemukan`);
      err.status = 404;
      return next(err);
    }
    res.status(200).json({ message: 'Kamar berhasil dihapus' });
  } catch (err) {
    next(err);
  }
};
