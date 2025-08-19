import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Alert, Spinner, Card, Form } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { getProductById } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(productId);
        setProduct(data);
        
        // Reset quantity when product changes
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <Button as={Link} to="/products" variant="outline-primary">
          <FaArrowLeft /> Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Product not found
        </Alert>
        <Button as={Link} to="/products" variant="outline-primary">
          <FaArrowLeft /> Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button as={Link} to="/products" variant="outline-primary" className="mb-4">
        <FaArrowLeft /> Back to Products
      </Button>
      
      <Row>
        <Col md={6} className="mb-4">
          <Image 
            src={product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={product.name} 
            fluid 
            className="product-image shadow"
          />
        </Col>
        
        <Col md={6}>
          <h1>{product.name}</h1>
          <p className="text-muted">Category: {product.category}</p>
          <h3 className="text-primary mb-4">${product.price.toFixed(2)}</h3>
          
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>{product.description}</Card.Text>
            </Card.Body>
          </Card>
          
          {product.stock > 0 ? (
            <>
              <Form.Group className="mb-4">
                <Form.Label>Quantity</Form.Label>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(Math.max(parseInt(e.target.value) || 1, 1), product.stock))}
                    className="mx-2 text-center"
                    style={{ width: '80px' }}
                  />
                  <Button 
                    variant="outline-secondary"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
                  >
                    +
                  </Button>
                </div>
                <div className="text-muted mt-2">
                  {product.stock < 10 ? (
                    <small className="text-danger">Only {product.stock} items left in stock</small>
                  ) : (
                    <small>In stock</small>
                  )}
                </div>
              </Form.Group>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={handleAddToCart}
              >
                <FaShoppingCart className="me-2" />
                Add to Cart
              </Button>
            </>
          ) : (
            <Alert variant="danger">
              This product is currently out of stock
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;