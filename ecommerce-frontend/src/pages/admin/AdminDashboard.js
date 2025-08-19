import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaEdit } from 'react-icons/fa';
import { getAllOrders } from '../../api/admin';
import { getProducts } from '../../api/products';

const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersData = await getAllOrders();
        setRecentOrders(ordersData.slice(0, 5)); // Get 5 most recent orders
        
        // Calculate order statistics
        const stats = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0
        };
        
        ordersData.forEach(order => {
          if (stats.hasOwnProperty(order.status)) {
            stats[order.status]++;
          }
        });
        
        setOrderStats(stats);
        
        // Fetch products
        const productsData = await getProducts({ limit: 5 });
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary text-white h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h2>{orderStats.pending}</h2>
              <p className="mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info text-white h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h2>{orderStats.processing}</h2>
              <p className="mb-0">Processing Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning text-white h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h2>{orderStats.shipped}</h2>
              <p className="mb-0">Shipped Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h2>{orderStats.delivered}</h2>
              <p className="mb-0">Delivered Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={7} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Button as={Link} to="/admin/orders" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentOrders.length === 0 ? (
                <p className="text-center my-3">No orders found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <span className={`badge bg-${
                            order.status === 'pending' ? 'warning' : 
                            order.status === 'processing' ? 'info' :
                            order.status === 'shipped' ? 'primary' :
                            order.status === 'delivered' ? 'success' : 'secondary'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/admin/orders?view=${order._id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={5}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Products</h5>
              <Button as={Link} to="/admin/products" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <p className="text-center my-3">No products found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/admin/products/edit/${product._id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
          
          <div className="d-grid gap-2">
            <Button as={Link} to="/admin/products/add" variant="primary" className="mb-3">
              <FaBox className="me-2" /> Add New Product
            </Button>
            <Button as={Link} to="/admin/orders" variant="secondary">
              <FaShoppingCart className="me-2" /> Manage Orders
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;