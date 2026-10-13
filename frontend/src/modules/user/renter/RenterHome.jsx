import { useEffect, useState } from "react";
import { Container, Tabs, Tab, Table } from "react-bootstrap";
import Navbar from "../../common/Navbar";
import AllProperties from "./AllProperties";
import api from "../../../api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await api.get("/user/getallbookings");
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
      <h5 className="mb-3" style={{ color: "var(--brand)" }}>All My Bookings</h5>

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
              <th>Phone</th>
              <th>Booking Status</th>
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
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default function RenterHome() {
  return (
    <div className="page-bg">
      <Navbar />
      <Container className="py-4">
        <Tabs defaultActiveKey="properties" className="mb-4" mountOnEnter unmountOnExit>
          <Tab eventKey="properties" title="All Properties">
            <AllProperties />
          </Tab>
          <Tab eventKey="history" title="Booking History">
            <BookingHistory />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}