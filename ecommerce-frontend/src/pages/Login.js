import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return null; // Or show a loading spinner
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white text-center py-3">
              Sign In
            </Card.Header>
            <Card.Body className="p-4">
              <LoginForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;