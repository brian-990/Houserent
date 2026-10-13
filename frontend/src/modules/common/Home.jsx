import { Link } from "react-router-dom";
import { Carousel, Container } from "react-bootstrap";
import Navbar from "./Navbar";
import AllPropertiesCards from "../user/AllPropertiesCards";
import hero1 from "../../images/hero1.jpg";
import hero2 from "../../images/hero2.jpg";
import hero3 from "../../images/hero3.jpg";

const slides = [hero1, hero2, hero3];

export default function Home() {
  return (
    <div className="page-bg">
      <Navbar />

      {/* BANNER */}
      <Carousel fade controls={false} interval={3500}>
        {slides.map((img, i) => (
          <Carousel.Item key={i}>
            <div
              style={{
                height: "70vh",
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65)), url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Carousel.Caption className="pb-5">
              <h1 className="fw-bold">Find Your Dream Rental Property</h1>
              <p>Comfort, Convenience &amp; Class, All in One Place</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* PROPERTY */}
      <Container className="py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Explore Our Premium Properties</h2>
          <p className="mb-0">
            Looking to post your property?{" "}
            <Link to="/register" className="btn btn-outline-primary btn-sm ms-1">
              Register as Owner
            </Link>
          </p>
        </div>

        <AllPropertiesCards />
      </Container>
    </div>
  );
}