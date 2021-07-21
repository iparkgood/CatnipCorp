import React, { useState, useEffect } from "react";
import { UpdateProduct, AdminProductCard, AddProduct } from "./index";
import { Container, Button, Row, Form, FormControl } from "react-bootstrap";
import "../css/Product.css";

const AdminProductPage = ({ products, setProducts, setAvailableProducts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState({});
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([])

useEffect(() => {
  if (products) {
    const categories = products.map((product) => product.category);
    const filtered = [...new Set(categories)];
    setFilteredCategories(filtered);
  }
}, [products])

  const handleAddProductButton = () => {
    setShowAddModal(true);
  };

  const handleSelection = (event) => {
    setCategoryInput(event.target.value);
  };

  const filterProductsByCategory = (selection, products) => {
    if (!selection) return products;
    return products.filter((product) => {
      return product.category === selection;
    });
  };

  console.log("admin products", products);

  return (
    <Container>
      {showEditModal ? (
        <UpdateProduct
          product={productToEdit}
          setShowEditModal={setShowEditModal}
          setProducts={setProducts}
        />
      ) : showAddModal ? (
        <AddProduct
          setShowAddModal={setShowAddModal}
          setProducts={setProducts}
        />
      ) : (
        <>
          <Container className="admin__product__header">
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Control
                as="select"
                value={categoryInput}
                onChange={handleSelection}
              >
                <option key="all" value="">
                  All Products
                </option>
                {filteredCategories.map((category, i) => {
                  const name =
                    category.charAt(0).toUpperCase() + category.slice(1);
                  return (
                    <option key={i} value={category}>
                      {name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form inline>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Button variant="success" onClick={handleAddProductButton}>
              Add Product
            </Button>
          </Container>
          <Container>
            <Row>
              {products &&
                filterProductsByCategory(
                  categoryInput,
                  products
                ).map((product) => (
                  <AdminProductCard
                    key={product.id}
                    product={product}
                    setProducts={setProducts}
                    setAvailableProducts={setAvailableProducts}
                    setShowEditModal={setShowEditModal}
                    setProductToEdit={setProductToEdit}
                  />
                ))}
            </Row>
          </Container>
        </>
      )}
    </Container>
  );
};

export default AdminProductPage;
