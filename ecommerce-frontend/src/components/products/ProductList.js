import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import ProductCard from '../common/ProductCard';
import Pagination from '../common/Pagination';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import { getProducts } from '../../api/products';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          skip: (currentPage - 1) * productsPerPage,
          limit: productsPerPage
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (category) {
          params.category = category;
        }
        
        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, category]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryFilter = (selectedCategory) => {
    setCategory(selectedCategory);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col md={8}>
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col md={4}>
          <FilterBar onCategorySelect={handleCategoryFilter} selectedCategory={category} />
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
      ) : products.length === 0 ? (
        <Alert variant="info">
          No products found. Try changing your search or filter criteria.
        </Alert>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <Pagination
            currentPage={currentPage}
            totalPages={10} // This would be calculated from total products count
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default ProductList;