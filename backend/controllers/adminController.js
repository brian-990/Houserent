const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

// cek apakah yang akses itu admin
const checkAdmin = async (userId) => {
  const user = await userSchema.findById(userId);
  return user && user.type === "Admin";
};

// SEMUA USER
const getAllUsersController = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId))) {
      return res.status(403).send({ message: "Khusus admin", success: false });
    }
    const users = await userSchema.find({}).select("-password");
    return res.status(200).send({ success: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// GRANT / UNGRANT OWNER
const handleStatusController = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId))) {
      return res.status(403).send({ message: "Khusus admin", success: false });
    }

    const { userid, status } = req.body;

    const owner = await userSchema.findById(userid);
    if (!owner || owner.type !== "Owner") {
      return res
        .status(404)
        .send({ message: "Owner tidak ditemukan", success: false });
    }

    owner.granted = status; // "granted" atau "ungranted"
    await owner.save();

    return res
      .status(200)
      .send({ message: `Status owner diubah jadi ${status}`, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SEMUA PROPERTY
const getAllPropertiesController = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId))) {
      return res.status(403).send({ message: "Khusus admin", success: false });
    }
    const properties = await propertySchema.find({});
    return res.status(200).send({ success: true, data: properties });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SEMUA BOOKING
const getAllBookingsController = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId))) {
      return res.status(403).send({ message: "Khusus admin", success: false });
    }
    const bookings = await bookingSchema.find({});
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
};