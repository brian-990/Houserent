import { useEffect, useState } from "react";
import { Table, Modal, Row, Col } from "react-bootstrap";
import useToast from "../../common/Toast";
import api from "../../../api";

export default function AllProperties() {
  const [toastElement, showToast] = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const getProperties = async () => {
    try {
      const res = await api.get("/owner/getallproperties");
      if (res.data.success) setProperties(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus property ini?")) return;
    try {
      const res = await api.delete(`/owner/deleteproperty/${id}`);
      if (res.data.success) {
        showToast("Property dihapus", "success");
        getProperties();
      } else {
        showToast(res.data.message, "danger");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal menghapus", "danger");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    const fields = [
      "propertyType",
      "propertyAdType",
      "propertyAddress",
      "ownerContact",
      "propertyAmt",
      "additionalInfo",
      "isAvailable",
    ];
    fields.forEach((f) => formData.append(f, editData[f] ?? ""));
    newImages.forEach((img) => formData.append("propertyImages", img));

    try {
      setSaving(true);
      const res = await api.patch(`/owner/updateproperty/${editData._id}`, formData);
      if (res.data.success) {
        showToast("Property diupdate", "success");
        setEditData(null);
        setNewImages([]);
        getProperties();
      } else {
        showToast(res.data.message, "danger");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal update", "danger");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-dark p-3">
      {toastElement}

      {loading ? (
        <p className="text-center text-secondary my-3">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-secondary my-3">Belum ada property</p>
      ) : (
        <Table responsive bordered className="table-dark-custom align-middle text-center mb-0">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Property Type</th>
              <th>Ad Type</th>
              <th>Address</th>
              <th>Owner Contact</th>
              <th>Amount</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td><small>{p._id}</small></td>
                <td>{p.propertyType}</td>
                <td>{p.propertyAdType}</td>
                <td>{p.propertyAddress}</td>
                <td>{p.ownerContact}</td>
                <td>Rp {Number(p.propertyAmt).toLocaleString("id-ID")}</td>
                <td className={p.isAvailable === "Available" ? "text-available" : "text-unavailable"}>
                  {p.isAvailable}
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => setEditData(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* MODAL EDIT */}
      <Modal show={!!editData} onHide={() => setEditData(null)} size="lg" centered>
        <div className="card-dark">
          <Modal.Header closeButton closeVariant="white" style={{ borderColor: "var(--border)" }}>
            <Modal.Title>Edit Property</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editData && (
              <Row className="g-3">
                <Col md={6}>
                  <label className="form-label">Property Type</label>
                  <select name="propertyType" className="form-select" value={editData.propertyType} onChange={handleEditChange}>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land/plot">Land/Plot</option>
                  </select>
                </Col>
                <Col md={6}>
                  <label className="form-label">Ad Type</label>
                  <select name="propertyAdType" className="form-select" value={editData.propertyAdType} onChange={handleEditChange}>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </Col>
                <Col md={12}>
                  <label className="form-label">Address</label>
                  <input name="propertyAddress" className="form-control" value={editData.propertyAddress} onChange={handleEditChange} />
                </Col>
                <Col md={6}>
                  <label className="form-label">Owner Contact</label>
                  <input name="ownerContact" className="form-control" value={editData.ownerContact} onChange={handleEditChange} />
                </Col>
                <Col md={6}>
                  <label className="form-label">Amount</label>
                  <input type="number" name="propertyAmt" className="form-control" value={editData.propertyAmt} onChange={handleEditChange} />
                </Col>
                <Col md={6}>
                  <label className="form-label">Availability</label>
                  <select name="isAvailable" className="form-select" value={editData.isAvailable} onChange={handleEditChange}>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </Col>
                <Col md={6}>
                  <label className="form-label">Ganti Gambar (opsional)</label>
                  <input type="file" className="form-control" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files))} />
                </Col>
                <Col md={12}>
                  <label className="form-label">Additional Info</label>
                  <textarea name="additionalInfo" rows={3} className="form-control" value={editData.additionalInfo || ""} onChange={handleEditChange} />
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderColor: "var(--border)" }}>
            <button className="btn btn-secondary" onClick={() => setEditData(null)}>Batal</button>
            <button className="btn btn-primary-custom" onClick={handleUpdate} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}