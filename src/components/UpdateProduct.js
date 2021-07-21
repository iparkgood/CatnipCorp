import React, { useState, useEffect } from "react";
import { fetchCategories } from "../api/products";
import { Form, Button, Container } from "react-bootstrap";
import { updateProduct } from "../api/products";
import "../css/UpdateProduct.css";

const UpdateProduct = ({ product, setShowEditModal, setProducts }) => {
  const {
    id,
    name,
    description,
    price,
    category,
    categoryId,
    quantity,
  } = product;
  const [categories, setCategories] = useState([]);
  const [nameInput, setNameInput] = useState(name);
  const [descInput, setDescInput] = useState(description);
  const [priceInput, setPriceInput] = useState(price);
  const [categoryInput, setCategoryInput] = useState(categoryId);
  const [quantityInput, setQuantityInput] = useState(quantity);

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
    setShowEditModal(false);
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    setShowEditModal(false);
    console.log({ categoryInput });
    const updatedProduct = await updateProduct({
      id,
      name: nameInput,
      description: descInput,
      price: priceInput,
      quantity: quantityInput,
      categoryId: categoryInput,
    });
    setProducts((products) => {
      return products.map((_product) => {
        if (_product.id !== id) return _product;
        return updatedProduct;
      });
    });
  };

  return (
    <>
      <Container>
        <h1>Update Product</h1>
      </Container>
      <Form id="product__form">
        <Form.Group controlId="editProductTitle">
          <Form.Label>Name</Form.Label>
          <Form.Control value={nameInput} onChange={nameHandler} />
        </Form.Group>
        <Form.Group controlId="editProductDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descInput}
            onChange={descHandler}
          />
        </Form.Group>
        <Form.Group controlId="editProductPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control value={priceInput} onChange={priceHandler} />
        </Form.Group>
        <Form.Group controlId="editProductInventory">
          <Form.Label>Inventory</Form.Label>
          <Form.Control value={quantityInput} onChange={inventoryHandler} />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" onChange={categoryHandler}>
            <option key={0}>Select Category</option>
            {categories.map((category) => {
              let { id, name } = category;
              id = parseInt(id);
              name = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleUpdateProduct}>
          Update
        </Button>
        <Button variant="danger" onClick={handleCancelEdit}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

export default UpdateProduct;
