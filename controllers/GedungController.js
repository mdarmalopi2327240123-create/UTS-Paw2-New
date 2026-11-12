const Gedung = require('../models/GedungModels');

exports.create = async (req, res, next) => {
  try {
    const { kode, nama } = req.body;
    const gedung = await Gedung.create({ kode, nama });
    res.status(201).json(gedung);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await Gedung.find();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Gedung.findById(req.params.id);
    if (!data) {
      const err = new Error(`Gedung dengan id ${req.params.id} tidak ditemukan`);
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
    const updates = {};
    if (req.body.kode !== undefined) updates.kode = req.body.kode;
    if (req.body.nama !== undefined) updates.nama = req.body.nama;
    const data = await Gedung.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) {
      const err = new Error(`Gedung dengan id ${req.params.id} tidak ditemukan`);
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
    const data = await Gedung.findByIdAndDelete(req.params.id);
    if (!data) {
      const err = new Error(`Gedung dengan id ${req.params.id} tidak ditemukan`);
      err.status = 404;
      return next(err);
    }
    res.status(200).json({ message: `Gedung berhasil dihapus` });
  } catch (err) {
    next(err);
  }
};
