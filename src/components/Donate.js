import React, { useState } from "react";
import { Modal, Button, Image } from "react-bootstrap";
const Donate = () => {
  const [show, setShow] = useState(true);
  console.log(show)
  const handleClose = () => setShow(false);
  const openTab = () => {
    window.open(
      "https://secure.aspca.org/donate/donate?ms=wb_hom_position1-jul-evergreen-20210701&initialms=wb_hom_position1-jul-evergreen-20210701&pcode=WEB1HOM&lpcode=WEB2HOM",
      "_blank"
    );
    handleClose();
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Donate to ASPCA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Thank you for your purchase! Please consider donating to ASPCA today -
        any amount helps!
      </Modal.Body>
      <Image src="" fluid />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Sorry, puppies
        </Button>
        <Button variant="primary" onClick={openTab}>
          Go to ASPCA
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Donate;
