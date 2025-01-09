import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import Carousel from 'react-bootstrap/Carousel';

// Import assets
import worldImg from './assets/world.png';
import heroImg from './assets/museum1.jpg';
import heroImg1 from './assets/museum2.jpg';
import heroImg02 from './assets/hero-img02.jpg';
import backgroundVideo from './assets/video1.mp4';
import ticketspot from './assets/LogoTicketspott.png';

// Import components
import Navbar from "./Navbar";
import Footer from "./footer";
import Chatbot from "./chatbot";
import DiscountCoupon from './Discount';
import Subtitle from '../shared/subtitle.jsx';
import Testimonials from './Testimonial/Testimonials';

// Placeholder images
const placeholderImages = [
  './assets/museum1.jpg',
  './assets/museum2.jpg',
  './assets/museum3.jpg',
  './assets/museum4.jpg',
  './assets/museum5.jpg',
  './assets/museum6.jpeg'
];

// CounterBox Component
const CounterBox = ({ target, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If target is 0, immediately set count to 0
    if (target === 0) return;

    const duration = 2000; // Total animation duration in ms
    const interval = 30; // Smaller interval for smoother animation
    const steps = duration / interval;
    const increment = target / steps;

    const timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + increment;
        if (nextCount >= target) {
          clearInterval(timer);
          return target;
        }
        return nextCount;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="counter__box">
      <h3 className="counter__number">{Math.round(count)}</h3>
      <span className="counter__label">{label}</span>
    </div>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toggle, setToggle] = useState(false);
  const [placeData, setPlaceData] = useState({ name: '', id: null });
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy placeholders in case the API does not return data
  const placeholderData = [
    { 
      id: 1, 
      MonumentName: "Indian Museum", 
      MonumentImage: placeholderImages[0], 
      address: "India",
      imageUrl: [placeholderImages[0]]
    },
    { 
      id: 2, 
      MonumentName: "National Museum", 
      MonumentImage: placeholderImages[1], 
      address: "India",
      imageUrl: [placeholderImages[1]]
    }
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/Recommend/', {
          withCredentials: true
        });
        
        setRecommendedPlaces(
          response.data.length > 0 
            ? response.data 
            : placeholderData
        );
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedPlaces(placeholderData);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handlePlaceClick = (place) => {
    setPlaceData({ name: place.MonumentName, id: place.id });
    setToggle(true);
  };

  const handleCloseChatbot = () => {
    setToggle(false);
    setPlaceData({ name: '', id: null });
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "4rem" }}></div> {/* Spacer with custom height */}


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-video-container">
          <video autoPlay muted loop className="hero-video">
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>
        
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={'TICKETSPOT: YOUR GATEWAY TO'} />
                  <img src={worldImg} alt="Monuments" />
                </div>
                <h1 className="text-white">
                  Explore most iconic <span className='highlight'>museums and monuments</span> around India with ease.
                </h1>
                <p className="text-white">
                  Book your tickets through TicketSpot and experience the wonders of India, anytime, anywhere.
                </p>
              </div>
            </div>

          
          </div>
        </div>
      </section>

      {/* Discount Coupon Section */}
      <section>
        <DiscountCoupon />
      </section>

      {/* Recommended Places Section */}
      <section className="recommended-places">
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={'Explore'} />
              <h2 className="featured__tour-title">Our Recommendations</h2>
            </Col>
            <Col lg="12">
              <div className="carousel-wrapper">
                {!loading && (
                  <Carousel fade>
                    {recommendedPlaces.slice(0, 3).map((place, index) => (
                      <Carousel.Item
                        key={place.id}
                        interval={index === 0 ? 1000 : 500}
                        onClick={() => handlePlaceClick(place)}
                      >
                        <img
                          className="d-block w-100 rounded carousel-image"
                          src={place.imageUrl[0]}
                          alt={place.MonumentName}
                        />
                        <Carousel.Caption>
                          <h3>{place.MonumentName}</h3>
                          <p>{place.address}</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Experience Section */}
      {/* Experience Section */}
      <section>
        <Container>
          <Row>
          <Col lg='6' className="ml-12">
              <div className="experience__content">
                <Subtitle subtitle={'Get to know us'} />
                <h2>Statistics about Ticketspot</h2>
                <p>
                  Step into a world of wonder and history at our museums. From ancient artifacts to contemporary masterpieces, 
                  our curated collections offer a journey through time and human creativity.
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>500k+</span>
                  <h6>Visitors Annually</h6>
                </div>
                <div className="counter__box">
                  <span>100+</span>
                  <h6>Cities covered</h6>
                </div>
                <div className="counter__box">
                  <span>50+</span>
                  <h6>50+ events listed</h6>
                </div>
              </div>
            </Col>
            <Col lg='5'>
              <div className="experience__img">
                <img src={ticketspot} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Testimonials Section */}
      <section>
        <Container>
          <Row>
            <Col lg='12'>
              <Subtitle subtitle={'Feedback'} />
              <h2 className="testimonial__title">What people say about us!</h2>
            </Col>
            <Testimonials />
          </Row>
        </Container>
      </section>

      {/* Chatbot Icon */}
      <div 
        className="chatbot-icon" 
        onClick={() => setToggle(!toggle)}
      >
        <i className="fas fa-comment-dots"></i>
      </div>

      {/* Chatbot */}
      {toggle && (
        <div className="chatbot-container">
          <Chatbot 
            place={placeData} 
            onClose={handleCloseChatbot} 
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Home;