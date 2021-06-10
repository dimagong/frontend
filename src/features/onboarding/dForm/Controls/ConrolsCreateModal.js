import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { Settings } from "react-feather";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy"
import {X, Check, Plus} from "react-feather"
import { v4 } from 'uuid'

const DFormCreateModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    // props.onOpen();
  };

  const handleSave = () => {
    setShow(false);
    // setTimeout(() => {
    //   props.onSave();
    // });
  };

  const handleDelete = () => {
    setShow(false);
    // setTimeout(() => {
    //   props.onDelete();
    // });
  };

  return (
    <div>
      {/* <Button variant="primary" onClick={handleShow} className="text-center">
                <MdSettings/>
            </Button>
             */}
      <Settings size={20} className="cursor-pointer" onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>1UI settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row" key={v4()}>
            <div className="col-md-12 form-group">
              <input
                // id={`${objKey}`}
                // value={this.state.fieldEdit.propertyKey}
                type="text"
                // data-id={objKey}
                // onChange={(event) =>
                //   this.setState({
                //     fieldEdit: { propertyKey: event.target.value },
                //   })
                // }
                className="form-control"
                placeholder="Name"
              />
            </div>
            <div className="col-md-12 form-group">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="is protected"
                // onChange={(event) => {
                //   this.setState({
                //     uiSettings: {
                //       ...this.state.uiSettings,
                //       protectedProperty: event.target.checked,
                //     },
                //   });
                // }}
                // checked={this.state.uiSettings.protectedProperty}
              />
            </div>
          </div>
          <div className="border-top">
            <div className="row">
              <h4 style={{ margin: "15px auto" }}>Conditions</h4>
            </div>
            {/* {dependencyFields} */}
            <div className="row m-2">
              <div
                className="form-create__add-new-group"
                // onClick={this.addConditional.bind(this, dependencyType, objKey)}
              >
                Add condition
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="d-flex justify-content-start">
            <Button onClick={handleSave} variant="primary">
              Save
            </Button>
          </div>
          <div className="d-flex justify-content-end">
            <Button onClick={handleDelete} variant="danger mr-1">
              Delete
            </Button>
            {/* <Button variant="warning" onClick={handleClose}>
                            Cancel
                    </Button> */}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DFormCreateModal;
