import React, { useState, useEffect } from "react";
import { fetchCategories } from "../api/products";
import { Form, Button, Container } from "react-bootstrap";
import { addProduct } from "../api/products";

const AddProduct = ({ setShowAddModal, setProducts }) => {
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(async () => {
    const categories = await fetchCategories();
    setCategories(categories);
  }, []);

  const nameHandler = (event) => {
    setNameInput(event.target.value);
  };

  const descHandler = (event) => {
    setDescInput(event.target.value);
  };

  const priceHandler = (event) => {
    setPriceInput(event.target.value);
  };

  const inventoryHandler = (event) => {
    setQuantityInput(event.target.value);
  };

  const categoryHandler = (event) => {
    const value = parseInt(event.target.value);
    setCategoryInput(value);
  };

  const handleCancelEdit = () => {
    setShowAddModal(false);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setShowAddModal(false);
    const newProduct = await addProduct({
      name: nameInput,
      description: descInput,
      price: priceInput,
      quantity: quantityInput,
      categoryId: categoryInput,
    });
    setProducts((products) => {
      const newProducts = [...products, newProduct];
      return newProducts;
    });
  };

  return (
    <>
      <Container>
        <h1>Add Product</h1>
      </Container>
      <Form id="product__form">
        <Form.Group controlId="addProductTitle">
          <Form.Label>Name</Form.Label>
          <Form.Control value={nameInput} onChange={nameHandler} />
        </Form.Group>
        <Form.Group controlId="addProductDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descInput}
            onChange={descHandler}
          />
        </Form.Group>
        <Form.Group controlId="addProductPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control value={priceInput} onChange={priceHandler} />
        </Form.Group>
        <Form.Group controlId="addProductInventory">
          <Form.Label>Inventory</Form.Label>
          <Form.Control value={quantityInput} onChange={inventoryHandler} />
        </Form.Group>
        <Form.Group controlId="addCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryInput}
            onChange={categoryHandler}
          >
            <option key={0}>Select Category</option>
            {categories.map((category) => {
              let { id, name } = category;
              name = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleAddProduct}>
          Add
        </Button>
        <Button variant="danger" onClick={handleCancelEdit}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

export default AddProduct;
