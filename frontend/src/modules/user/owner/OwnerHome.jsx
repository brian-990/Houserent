import { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import Navbar from "../../common/Navbar";
import AddProperty from "./AddProperty";
import AllProperties from "./AllProperties";
import AllBookings from "./AllBookings";
import api from "../../../api";

export default function OwnerHome() {
  const [granted, setGranted] = useState(null);

  // ambil status terbaru, karena admin bisa approve setelah owner login
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("/user/getuserdata");
        if (res.data.success) {
          setGranted(res.data.data.granted);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  return (
    <div className="page-bg">
      <Navbar />
      <Container className="py-4">
        {granted === null ? (
          <p className="text-center text-secondary">Loading...</p>
        ) : granted !== "granted" ? (
          <div className="card-dark p-4 text-center">
            <h5 className="mb-2">Akun kamu belum di-approve admin</h5>
            <p className="text-secondary mb-0">
              Setelah admin memberikan akses, kamu bisa menambahkan property.
            </p>
          </div>
        ) : (
          <Tabs defaultActiveKey="add" className="mb-4" mountOnEnter unmountOnExit>
            <Tab eventKey="add" title="Add Property">
              <AddProperty />
            </Tab>
            <Tab eventKey="properties" title="All Properties">
              <AllProperties />
            </Tab>
            <Tab eventKey="bookings" title="All Bookings">
              <AllBookings />
            </Tab>
          </Tabs>
        )}
      </Container>
    </div>
  );
}