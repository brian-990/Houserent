import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import useToast from "../../common/Toast";
import api from "../../../api";

export default function AllBookings() {
  const [toastElement, showToast] = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    try {
      const res = await api.get("/owner/getallbookings");
      if (res.data.success) setBookings(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const handleStatus = async (booking, status) => {
    try {
      const res = await api.post("/owner/handlebookingstatus", {
        bookingId: booking._id,
        propertyId: booking.propertyId,
        status,
      });
      if (res.data.success) {
        showToast(res.data.message, "success");
        getBookings();
      } else {
        showToast(res.data.message, "danger");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal ubah status", "danger");
    }
  };

  return (
    <div className="card-dark p-3">
      {toastElement}

      {loading ? (
        <p className="text-center text-secondary my-3">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-secondary my-3">Belum ada booking</p>
      ) : (
        <Table responsive bordered className="table-dark-custom align-middle text-center mb-0">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Property ID</th>
              <th>Tenant Name</th>
              <th>Tenant Phone</th>
              <th>Booking Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><small>{b._id}</small></td>
                <td><small>{b.propertyId}</small></td>
                <td>{b.userName}</td>
                <td>{b.phone}</td>
                <td className={b.bookingStatus === "booked" ? "text-available" : "text-pending"}>
                  {b.bookingStatus}
                </td>
                <td>
                  {b.bookingStatus === "booked" ? (
                    <button className="btn btn-warning btn-sm" onClick={() => handleStatus(b, "pending")}>
                      Mark Pending
                    </button>
                  ) : (
                    <button className="btn btn-success btn-sm" onClick={() => handleStatus(b, "booked")}>
                      Mark Booked
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}