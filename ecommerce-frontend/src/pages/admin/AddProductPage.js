import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProductForm from '../../components/admin/ProductForm';
import { toast } from 'react-toastify';

const AddProductPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = (productId) => {
    toast.success('Product created successfully!');
    navigate('/admin/products');
  };
  
  return (
    <Container className="my-5">
      <Button as={Link} to="/admin/products" variant="outline-primary" className="mb-4">
        <FaArrowLeft /> Back to Products
      </Button>
      
      <h1 className="mb-4">Add New Product</h1>
      
      <Card>
        <Card.Body>
          <ProductForm onSuccess={handleSuccess} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProductPage;