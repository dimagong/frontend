import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap";
import { toast } from "react-toastify";

class Toastr extends React.Component {
  notifyDefault = () => toast("This is default toast!");
  notifySuccess = () => toast.success("This is success toast!");
  notifyError = () => toast.error("This is error toast!");
  notifyInfo = () => toast.info("This is info toast!");
  notifyWarning = () => toast.warning("This is warning toast!");

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Types</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="primary" onClick={this.notifyDefault} outline>
              Default
            </Button>
          </div>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="success" onClick={this.notifySuccess} outline>
              Success
            </Button>
          </div>
          <div className="d-inline-block mr-1 mb-1">
            {" "}
            <Button color="info" onClick={this.notifyError} outline>
              Danger
            </Button>{" "}
          </div>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="warning" onClick={this.notifyInfo} outline>
              Info
            </Button>{" "}
          </div>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="danger" onClick={this.notifyWarning} outline>
              Warning
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Toastr;
