import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../../api/orders';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const CheckoutForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { clearAllItems } = useCart();

  const validationSchema = Yup.object().shape({
    address_line1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State/Province is required'),
    postal_code: Yup.string().required('ZIP/Postal code is required'),
    country: Yup.string().required('Country is required')
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        shipping_address: {
          address_line1: values.address_line1,
          address_line2: values.address_line2 || '',
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
          country: values.country
        }
      };

      const response = await checkout(orderData);
      
      // Clear cart after successful checkout
      await clearAllItems();
      
      toast.success('Order placed successfully!');
      navigate(`/orders/${response._id}`);
    } catch (error) {
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit
      }) => (
        <Form onSubmit={handleSubmit}>
          <h3 className="mb-3">Shipping Information</h3>
          
          <Form.Group className="mb-3">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              name="address_line1"
              value={values.address_line1}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.address_line1 && errors.address_line1}
              placeholder="Street address, P.O. box, etc."
            />
            <Form.Control.Feedback type="invalid">
              {errors.address_line1}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Address Line 2 (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="address_line2"
              value={values.address_line2}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </Form.Group>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.city && errors.city}
                  placeholder="City"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>State / Province</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.state && errors.state}
                  placeholder="State or province"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>ZIP / Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  name="postal_code"
                  value={values.postal_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.postal_code && errors.postal_code}
                  placeholder="Postal code"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.postal_code}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.country && errors.country}
                  placeholder="Country"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="mt-3 w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutForm;