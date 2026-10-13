const fs = require("fs");
const path = require("path");
const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

// hapus file gambar dari folder uploads
const deleteImages = (images) => {
  if (!Array.isArray(images)) return;
  images.forEach((img) => {
    const filePath = path.join(__dirname, "..", "uploads", img.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });
};

// TAMBAH PROPERTY
const addPropertyController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.userId);
    if (!user || user.type !== "Owner") {
      return res
        .status(403)
        .send({ message: "Hanya owner yang bisa tambah property", success: false });
    }
    if (user.granted !== "granted") {
      return res
        .status(403)
        .send({ message: "Akun owner belum di-approve admin", success: false });
    }

    const images = (req.files || []).map((file) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    }));

    const newProperty = new propertySchema({
      ...req.body,
      propertyImage: images,
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newProperty.save();
    return res
      .status(201)
      .send({ message: "Property berhasil ditambahkan", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SEMUA PROPERTY MILIK OWNER
const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const properties = await propertySchema.find({ ownerId: req.userId });
    return res.status(200).send({ success: true, data: properties });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// UPDATE PROPERTY
const updatePropertyController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const property = await propertySchema.findOne({
      _id: propertyid,
      ownerId: req.userId,
    });
    if (!property) {
      return res
        .status(404)
        .send({ message: "Property tidak ditemukan", success: false });
    }

    const updateData = { ...req.body };

    // kalau upload gambar baru, gambar lama diganti
    if (req.files && req.files.length > 0) {
      deleteImages(property.propertyImage);
      updateData.propertyImage = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    await propertySchema.findByIdAndUpdate(propertyid, updateData);
    return res
      .status(200)
      .send({ message: "Property berhasil diupdate", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// HAPUS PROPERTY
const deletePropertyController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const property = await propertySchema.findOne({
      _id: propertyid,
      ownerId: req.userId,
    });
    if (!property) {
      return res
        .status(404)
        .send({ message: "Property tidak ditemukan", success: false });
    }

    deleteImages(property.propertyImage);
    await propertySchema.findByIdAndDelete(propertyid);
    await bookingSchema.deleteMany({ propertyId: propertyid });

    return res
      .status(200)
      .send({ message: "Property berhasil dihapus", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SEMUA BOOKING DI PROPERTY MILIK OWNER
const getAllOwnerBookingsController = async (req, res) => {
  try {
    const bookings = await bookingSchema.find({ ownerID: req.userId });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// UBAH STATUS BOOKING (pending / booked)
const handleBookingStatusController = async (req, res) => {
  try {
    const { bookingId, propertyId, status } = req.body;

    const booking = await bookingSchema.findOne({
      _id: bookingId,
      ownerID: req.userId,
    });
    if (!booking) {
      return res
        .status(404)
        .send({ message: "Booking tidak ditemukan", success: false });
    }

    booking.bookingStatus = status;
    await booking.save();

    // kalau sudah booked, property jadi Unavailable
    await propertySchema.findByIdAndUpdate(propertyId, {
      isAvailable: status === "booked" ? "Unavailable" : "Available",
    });

    return res
      .status(200)
      .send({ message: `Status booking diubah jadi ${status}`, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  updatePropertyController,
  deletePropertyController,
  getAllOwnerBookingsController,
  handleBookingStatusController,
};