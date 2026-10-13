import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import api from "../../api";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await api.get("/admin/getallbookings");
        if (res.data.success) setBookings(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  return (
    <div className="card-dark p-3">
      {loading ? (
        <p className="text-center text-secondary my-3">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-secondary my-3">Belum ada booking</p>
      ) : (
        <Table responsive bordered className="table-dark-custom align-middle text-center mb-0">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Owner ID</th>
              <th>Property ID</th>
              <th>Tenant ID</th>
              <th>Tenant Name</th>
              <th>Tenant Contact</th>
              <th>Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><small>{b._id}</small></td>
                <td><small>{b.ownerID}</small></td>
                <td><small style={{ color: "var(--brand)" }}>{b.propertyId}</small></td>
                <td><small>{b.userID}</small></td>
                <td>{b.userName}</td>
                <td>{b.phone}</td>
                <td className={b.bookingStatus === "booked" ? "text-available" : "text-pending"}>
                  {b.bookingStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}