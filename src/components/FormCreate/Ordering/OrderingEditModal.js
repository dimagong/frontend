import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import { MoreVertical } from "react-feather";

function OrderingEditModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
    props.onOpen();
  };

  return (
    <div>
      <MoreVertical size={20} className="cursor-pointer" onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ordering</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        {/*<Modal.Footer className="justify-content-between">*/}
        {/*    <div className="d-flex justify-content-start">*/}
        {/*        <Button onClick={handleSave} variant="primary">Save</Button>*/}
        {/*    </div>*/}
        {/*</Modal.Footer>*/}
      </Modal>
    </div>
  );
}

export default OrderingEditModal;
