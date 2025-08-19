import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addItem(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
        alt={product.name}
        height="200"
        style={{ objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted mb-2">{product.category}</Card.Text>
        <Card.Text className="product-description flex-grow-1">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="h5 mb-0">${product.price.toFixed(2)}</span>
          <div>
            <Button 
              as={Link}
              to={`/products/${product._id}`}
              variant="outline-primary"
              size="sm"
              className="me-2"
            >
              Details
            </Button>
            <Button 
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
        {product.stock > 0 && product.stock < 5 && (
          <small className="text-danger mt-2">Only {product.stock} left in stock!</small>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;