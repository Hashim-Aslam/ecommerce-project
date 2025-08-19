import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct, uploadProductImage } from '../../api/admin';

const ProductForm = ({ product = null, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const isEditMode = !!product;

  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    stock: Yup.number()
      .required('Stock quantity is required')
      .integer('Stock must be a whole number')
      .min(0, 'Stock cannot be negative')
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      let productId;
      
      if (isEditMode) {
        // Update existing product
        const updatedProduct = await updateProduct(product._id, values);
        productId = updatedProduct._id;
      } else {
        // Create new product
        const newProduct = await createProduct(values);
        productId = newProduct._id;
      }
      
      // Upload image if selected
      if (imageFile) {
        setIsUploading(true);
        await uploadProductImage(productId, imageFile);
      }
      
      if (onSuccess) {
        onSuccess(productId);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.name && errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.description && errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.price && errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={values.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.stock && errors.stock}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.category && errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Product Image</Form.Label>
            
            {imagePreview && (
              <div className="mb-3 text-center">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  style={{ maxHeight: '200px', maxWidth: '100%' }}
                  className="border rounded"
                />
              </div>
            )}
            
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Form.Text className="text-muted">
              Upload a product image. Recommended size: 800x600px.
            </Form.Text>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {(isSubmitting || isUploading) ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;