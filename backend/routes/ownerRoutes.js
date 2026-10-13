const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  addPropertyController,
  getAllOwnerPropertiesController,
  updatePropertyController,
  deletePropertyController,
  getAllOwnerBookingsController,
  handleBookingStatusController,
} = require("../controllers/ownerController");

const router = express.Router();

// setting upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

router.post("/postproperty", authMiddleware, upload.array("propertyImages"), addPropertyController);
router.get("/getallproperties", authMiddleware, getAllOwnerPropertiesController);
router.patch("/updateproperty/:propertyid", authMiddleware, upload.array("propertyImages"), updatePropertyController);
router.delete("/deleteproperty/:propertyid", authMiddleware, deletePropertyController);
router.get("/getallbookings", authMiddleware, getAllOwnerBookingsController);
router.post("/handlebookingstatus", authMiddleware, handleBookingStatusController);

module.exports = router;