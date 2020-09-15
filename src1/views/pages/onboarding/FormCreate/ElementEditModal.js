import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import {  Edit } from "react-feather"

function ElementEditModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        props.onOpen();
    }
    const handleSave = () => {
        setShow(false);
        setTimeout(() => {
            props.onSave();
        });
    }
    return (
        <div>
            {/* <Button variant="primary" onClick={handleShow} className="text-center">
                <MdBuild/>
            </Button> */}

            <Edit size={20} className="cursor-pointer" onClick={handleShow} />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.children}</Modal.Body>
                <Modal.Footer className="justify-content-between">                  
                    <Button onClick={handleSave} variant="primary">Save</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ElementEditModal;