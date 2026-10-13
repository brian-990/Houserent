import { Container, Tabs, Tab } from "react-bootstrap";
import Navbar from "../common/Navbar";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";

export default function AdminHome() {
  return (
    <div className="page-bg">
      <Navbar />
      <Container className="py-4">
        <Tabs defaultActiveKey="users" className="mb-4" mountOnEnter unmountOnExit>
          <Tab eventKey="users" title="All Users">
            <AllUsers />
          </Tab>
          <Tab eventKey="properties" title="All Properties">
            <AllProperty />
          </Tab>
          <Tab eventKey="bookings" title="All Bookings">
            <AllBookings />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}