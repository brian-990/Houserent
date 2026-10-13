
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

// REGISTER
const registerController = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const existsUser = await userSchema.findOne({ email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "Email sudah terdaftar", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
      type,
    });

    // owner harus di-approve admin dulu
    if (type === "Owner") {
      newUser.granted = "ungranted";
    }

    await newUser.save();
    return res
      .status(201)
      .send({ message: "Registrasi berhasil", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User tidak ditemukan", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Email atau password salah", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).send({
      message: "Login berhasil",
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// FORGOT PASSWORD (reset langsung pakai email)
const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User tidak ditemukan", success: false });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res
      .status(200)
      .send({ message: "Password berhasil diubah", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// AMBIL DATA USER YANG LOGIN
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(200)
        .send({ message: "User tidak ditemukan", success: false });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// SEMUA PROPERTY (bisa dilihat tanpa login)
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    return res.status(200).send({ success: true, data: allProperties });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// RENTER BOOKING PROPERTY
const bookingHandleController = async (req, res) => {
  try {
    const { propertyid } = req.params;
    const { userDetails, ownerId } = req.body;

    const property = await propertySchema.findById(propertyid);
    if (!property) {
      return res
        .status(200)
        .send({ message: "Property tidak ditemukan", success: false });
    }
    if (property.isAvailable !== "Available") {
      return res
        .status(200)
        .send({ message: "Property sedang tidak tersedia", success: false });
    }

    const booking = new bookingSchema({
      propertyId: propertyid,
      userID: req.userId,
      ownerID: ownerId || property.ownerId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: "pending",
    });

    await booking.save();
    return res
      .status(200)
      .send({ message: "Booking berhasil dikirim", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

// BOOKING MILIK RENTER YANG LOGIN
const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await bookingSchema.find({ userID: req.userId });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
};