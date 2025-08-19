import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProductForm from '../../components/admin/ProductForm';
import { getProductById } from '../../api/products';
import { toast } from 'react-toastify';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleSuccess = () => {
    toast.success('Product updated successfully!');
    navigate('/admin/products');
  };
  
  return (
    <Container className="my-5">
      <Button as={Link} to="/admin/products" variant="outline-primary" className="mb-4">
        <FaArrowLeft /> Back to Products
      </Button>
      
      <h1 className="mb-4">Edit Product</h1>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card>
          <Card.Body>
            <ProductForm product={product} onSuccess={handleSuccess} />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EditProductPage;