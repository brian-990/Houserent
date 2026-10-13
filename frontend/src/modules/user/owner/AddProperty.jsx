import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import useToast from "../../common/Toast";
import api from "../../../api";

const initialForm = {
  propertyType: "residential",
  propertyAdType: "rent",
  propertyAddress: "",
  ownerContact: "",
  propertyAmt: 0,
  additionalInfo: "",
};

export default function AddProperty() {
  const [toastElement, showToast] = useToast();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [fileKey, setFileKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.propertyAddress || !form.ownerContact) {
      return showToast("Alamat dan kontak wajib diisi", "danger");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach((img) => formData.append("propertyImages", img));

    try {
      setLoading(true);
      const res = await api.post("/owner/postproperty", formData);

      if (!res.data.success) {
        return showToast(res.data.message, "danger");
      }

      showToast("Property berhasil ditambahkan", "success");
      setForm(initialForm);
      setImages([]);
      setFileKey((k) => k + 1); // reset input file
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal menambahkan property", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-dark p-4">
      {toastElement}
      <h4 className="text-center fw-bold mb-4" style={{ color: "var(--brand)" }}>
        Add New Property
      </h4>

      <form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={4}>
            <label className="form-label">Property Type</label>
            <select
              name="propertyType"
              className="form-select"
              value={form.propertyType}
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land/plot">Land/Plot</option>
            </select>
          </Col>
          <Col md={4}>
            <label className="form-label">Property Ad Type</label>
            <select
              name="propertyAdType"
              className="form-select"
              value={form.propertyAdType}
              onChange={handleChange}
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </Col>
          <Col md={4}>
            <label className="form-label">Property Full Address</label>
            <input
              type="text"
              name="propertyAddress"
              className="form-control"
              placeholder="Address"
              value={form.propertyAddress}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <label className="form-label">Property Images</label>
            <input
              key={fileKey}
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
          </Col>
          <Col md={4}>
            <label className="form-label">Owner Contact No.</label>
            <input
              type="text"
              name="ownerContact"
              className="form-control"
              placeholder="Contact number"
              value={form.ownerContact}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <label className="form-label">Property Amount</label>
            <input
              type="number"
              name="propertyAmt"
              className="form-control"
              value={form.propertyAmt}
              onChange={handleChange}
            />
          </Col>

          <Col md={12}>
            <label className="form-label">Additional Details for the Property</label>
            <textarea
              name="additionalInfo"
              className="form-control"
              rows={3}
              placeholder="Add any details here..."
              value={form.additionalInfo}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary-custom" disabled={loading}>
            {loading ? "Menyimpan..." : "Submit Form"}
          </button>
        </div>
      </form>
    </div>
  );
}