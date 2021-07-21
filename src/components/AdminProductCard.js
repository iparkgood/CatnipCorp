import React, { useState } from "react";
import { Col, Card, Button, Modal } from "react-bootstrap";
import "../css/UpdateProduct.css";
import { updateProduct } from "../api/products";

const AdminProductCard = ({
  product,
  setProducts,
  setAvailableProducts,
  setShowEditModal,
  setProductToEdit,
}) => {
  const {
    id,
    name,
    description,
    price,
    imageName,
    quantity,
    categoryId,
    category,
  } = product;


  const handleEditProduct = () => {
    setShowEditModal(true);
    setProductToEdit(product);
  };

  const [show, setShow] = useState(false);

  const handleCancelDelete = () => {
    setShow(false);
  };
  const handleConfirmDelete = () => {
    setShow(false);
    handleDeleteProduct();
  };

  const handleDeleteModal = () => {
    setShow(true);
  };

  const handleDeleteProduct = async () => {
    // const deletedProduct = await deleteProduct(id);
    const deletedProduct = await updateProduct({ id, quantity: -1 });
    deletedProduct.category = category;
    deletedProduct.categoryId = categoryId;
    setAvailableProducts((products) => {
      return products.map((_product) => {
        if (_product.id !== id) return _product;
        return deletedProduct;
      });
    });
  };

  return (
    <>
      <Card className="admin__product__card">
        <Card.Img variant="top" src={`/images/${imageName}`} />
        <Col>
          <Card.Body className="product-card-body">
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Card.Text>${price}</Card.Text>
            <Card.Text>Inventory: {quantity}</Card.Text>
          </Card.Body>
          <Col className="update__product__buttons">
            <Button onClick={handleEditProduct}>Edit</Button>
            <Button variant="danger" onClick={handleDeleteModal}>
              Delete
            </Button>
          </Col>
        </Col>
      </Card>
      <Modal show={show} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this product?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminProductCard;
