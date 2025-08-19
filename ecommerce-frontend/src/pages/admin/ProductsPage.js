import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Row, Col, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { getProducts } from '../../api/products';
import { deleteProduct } from '../../api/admin';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ limit: 100 });
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete._id);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      toast.success(`${productToDelete.name} has been deleted`);
    } catch (err) {
      toast.error(`Failed to delete product: ${err.message}`);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Product Management</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/products/add" variant="primary">
            <FaPlus className="me-2" /> Add New Product
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </Form.Group>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info">
          No products found. {searchTerm && 'Try a different search term or'} <Link to="/admin/products/add">add a new product</Link>.
        </Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td style={{ width: '80px' }}>
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <Button 
                    as={Link} 
                    to={`/admin/products/edit/${product._id}`}
                    variant="outline-primary" 
                    size="sm"
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => openDeleteModal(product)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product: <strong>{productToDelete?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsPage;