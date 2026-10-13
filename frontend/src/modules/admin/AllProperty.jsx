import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../../api";

export default function AllProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await api.get("/admin/getallproperties");
        if (res.data.success) setProperties(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, []);

  return (
    <div className="card-dark p-3">
      {loading ? (
        <p className="text-center text-secondary my-3">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-secondary my-3">Belum ada property</p>
      ) : (
        <Table responsive bordered className="table-dark-custom align-middle text-center mb-0">
          <thead>
            <tr>
              <th>Property ID</th>
              <th>Owner ID</th>
              <th>Property Type</th>
              <th>Property Ad Type</th>
              <th>Property Address</th>
              <th>Owner Contact</th>
              <th>Property Amt</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td><small>{p._id}</small></td>
                <td><small>{p.ownerId}</small></td>
                <td style={{ color: "var(--brand)" }}>{p.propertyType}</td>
                <td>{p.propertyAdType}</td>
                <td>{p.propertyAddress}</td>
                <td>{p.ownerContact}</td>
                <td className="text-available">
                  Rp {Number(p.propertyAmt).toLocaleString("id-ID")}
                </td>
                <td className={p.isAvailable === "Available" ? "text-available" : "text-unavailable"}>
                  {p.isAvailable}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}