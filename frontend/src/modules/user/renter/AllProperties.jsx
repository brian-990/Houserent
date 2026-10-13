import { useState } from "react";
import { Modal, Row, Col, Carousel } from "react-bootstrap";
import AllPropertiesCards from "../AllPropertiesCards";
import useToast from "../../common/Toast";
import api, { BASE_URL } from "../../../api";

export default function AllProperties() {
  const [toastElement, showToast] = useToast();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setSelected(null);
    setForm({ fullName: "", phone: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      return showToast("Nama dan nomor HP wajib diisi", "danger");
    }

    try {
      setLoading(true);
      const res = await api.post(`/user/bookinghandle/${selected._id}`, {
        userDetails: form,
        ownerId: selected.ownerId,
      });

      if (!res.data.success) {
        return showToast(res.data.message, "danger");
      }

      showToast("Booking terkirim, tunggu konfirmasi owner", "success");
      handleClose();
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal booking", "danger");
    } finally {
      setLoading(false);
    }
  };

  const images = Array.isArray(selected?.propertyImage) ? selected.propertyImage : [];

  return (
    <div>
      {toastElement}
      <AllPropertiesCards isRenter onBook={(p) => setSelected(p)} />

      {/* MODAL DETAIL + BOOKING */}
      <Modal show={!!selected} onHide={handleClose} size="lg" centered>
        <div className="card-dark">
          <Modal.Header closeButton closeVariant="white" style={{ borderColor: "var(--border)" }}>
            <Modal.Title>Property Details</Modal.Title>
          </Modal.Header>

          {selected && (
            <Modal.Body>
              {images.length > 0 && (
                <Carousel className="mb-3" interval={null}>
                  {images.map((img, i) => (
                    <Carousel.Item key={i}>
                      <img
                        src={BASE_URL + img.path}
                        alt={`property-${i}`}
                        style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 8 }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1"><b>Address:</b> {selected.propertyAddress}</p>
                  <p className="mb-1"><b>Type:</b> {selected.propertyType} - {selected.propertyAdType}</p>
                  <p className="mb-1">
                    <b>Price:</b> Rp {Number(selected.propertyAmt).toLocaleString("id-ID")}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><b>Owner:</b> {selected.ownerName || "-"}</p>
                  <p className="mb-1"><b>Contact:</b> {selected.ownerContact}</p>
                  <p className="mb-1"><b>Availability:</b> {selected.isAvailable}</p>
                </Col>
                {selected.additionalInfo && (
                  <Col md={12} className="mt-2">
                    <p className="mb-0"><b>Additional Info:</b> {selected.additionalInfo}</p>
                  </Col>
                )}
              </Row>

              <hr style={{ borderColor: "var(--border)" }} />

              <h6 className="mb-3">Isi data untuk booking</h6>
              <form onSubmit={handleBooking}>
                <Row className="g-3">
                  <Col md={6}>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Full Name"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <div className="text-end mt-3">
                  <button type="submit" className="btn btn-primary-custom" disabled={loading}>
                    {loading ? "Mengirim..." : "Book Property"}
                  </button>
                </div>
              </form>
            </Modal.Body>
          )}
        </div>
      </Modal>
    </div>
  );
}