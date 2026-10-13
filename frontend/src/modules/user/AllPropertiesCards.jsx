import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import api, { BASE_URL } from "../../api";

export default function AllPropertiesCards({ isRenter = false, onBook }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adType, setAdType] = useState("");
  const [propType, setPropType] = useState("");

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await api.get("/user/getAllProperties");
        if (res.data.success) setProperties(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const matchSearch = p.propertyAddress
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchAd = adType ? p.propertyAdType === adType : true;
    const matchType = propType ? p.propertyType === propType : true;
    return matchSearch && matchAd && matchType;
  });

  const getImage = (p) => {
    if (Array.isArray(p.propertyImage) && p.propertyImage.length > 0) {
      return BASE_URL + p.propertyImage[0].path;
    }
    return null;
  };

  return (
    <div>
      {/* FILTER */}
      <Row className="g-2 mb-4">
        <Col md={6}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <select
            className="form-select"
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
          >
            <option value="">All Ad Types</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </Col>
        <Col md={3}>
          <select
            className="form-select"
            value={propType}
            onChange={(e) => setPropType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land/plot">Land/Plot</option>
          </select>
        </Col>
      </Row>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-secondary">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-secondary">Property tidak ditemukan</p>
      ) : (
        <Row className="g-3">
          {filtered.map((p) => {
            const available = p.isAvailable === "Available";
            const img = getImage(p);

            return (
              <Col key={p._id} sm={6} lg={4}>
                <div className="card-dark property-card">
                  {img ? (
                    <img src={img} alt={p.propertyAddress} />
                  ) : (
                    <div
                      style={{ height: 160, background: "#1f2937" }}
                      className="d-flex align-items-center justify-content-center text-secondary"
                    >
                      No Image
                    </div>
                  )}

                  <div className="card-body">
                    <h6 className="fw-bold mb-1">{p.propertyAddress}</h6>
                    <small className="text-secondary d-block mb-2">
                      {p.propertyType} - {p.propertyAdType}
                    </small>

                    {isRenter ? (
                      <>
                        <small className="d-block">
                          <b>Owner:</b> {p.ownerContact}
                        </small>
                        <small className="d-block">
                          <b>Availability:</b> {p.isAvailable}
                        </small>
                        <small className="d-block mb-2">
                          <b>Price:</b> Rp{" "}
                          {Number(p.propertyAmt).toLocaleString("id-ID")}
                        </small>

                        {available ? (
                          <button
                            className="btn btn-primary-custom btn-sm w-100"
                            onClick={() => onBook && onBook(p)}
                          >
                            Get Info / Book
                          </button>
                        ) : (
                          <small className="text-unavailable">Not Available</small>
                        )}
                      </>
                    ) : available ? (
                      <small className="text-pending">Login to see details</small>
                    ) : (
                      <small className="text-unavailable">Not Available</small>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}