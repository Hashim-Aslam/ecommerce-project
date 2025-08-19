import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Get latest products limited to 8
        const products = await getProducts({ limit: 8 });
        setFeaturedProducts(products);
      } catch (err) {
        setError('Failed to load featured products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Card className="bg-dark text-white mb-5 border-0">
        <Card.Img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="E-commerce banner" 
          style={{ height: '400px', objectFit: 'cover', filter: 'brightness(0.6)' }}
        />
        <Card.ImgOverlay className="d-flex flex-column justify-content-center text-center">
          <Card.Title className="display-4 fw-bold">Welcome to Our Store</Card.Title>
          <Card.Text className="fs-5 mb-4">
            Discover quality products at amazing prices
          </Card.Text>
          <div>
            <Button as={Link} to="/products" variant="primary" size="lg" className="me-2">
              Shop Now
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg">
              Join Us
            </Button>
          </div>
        </Card.ImgOverlay>
      </Card>

      {/* Categories Section */}
      <h2 className="text-center mb-4">Shop by Category</h2>
      <Row className="mb-5 g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Img 
              variant="top" 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              height="200"
              style={{ objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Card.Title>Electronics</Card.Title>
              <Button as={Link} to="/products?category=electronics" variant="outline-primary">
                Browse Electronics
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Img 
              variant="top" 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              height="200"
              style={{ objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Card.Title>Clothing</Card.Title>
              <Button as={Link} to="/products?category=clothing" variant="outline-primary">
                Browse Clothing
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Img 
              variant="top" 
              src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" 
              height="200"
              style={{ objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Card.Title>Home & Kitchen</Card.Title>
              <Button as={Link} to="/products?category=home" variant="outline-primary">
                Browse Home
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Featured Products Section */}
      <h2 className="text-center mb-4">Featured Products</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {featuredProducts.map(product => (
            <Col key={product._id} xs={12} sm={6} md={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
      
      <div className="text-center mt-4">
        <Button as={Link} to="/products" variant="primary">
          View All Products
        </Button>
      </div>
    </Container>
  );
};

export default Home;