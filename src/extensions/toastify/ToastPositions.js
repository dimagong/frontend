import React from "react";
import { Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap";
import { toast } from "react-toastify";

class ToastrPositions extends React.Component {
  notifyTopLeft = () =>
    toast.info("Top Left", {
      position: toast.POSITION.TOP_LEFT,
    });
  notifyTopCenter = () =>
    toast.info("Top Center", {
      position: toast.POSITION.TOP_CENTER,
    });
  notifyTopRight = () =>
    toast.info("This Right", {
      position: toast.POSITION.TOP_RIGHT,
    });

  notifyBottomLeft = () =>
    toast.info("Bottom Left", {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  notifyBottomCenter = () =>
    toast.info("Bottom Center", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  notifyBottomRight = () =>
    toast.info("This Right", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardBody>
          <h5 className="my-1">Top Positions</h5>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="primary" outline onClick={this.notifyTopLeft}>
              Top Left
            </Button>
          </div>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="primary" outline onClick={this.notifyTopCenter}>
              Top Center
            </Button>
          </div>
          <div className="d-inline-block mb-1">
            <Button color="primary" outline onClick={this.notifyTopRight}>
              Top Right
            </Button>
          </div>

          <h5 className="my-1">Bottom Positions</h5>

          <div className="d-inline-block mr-1 mb-1">
            <Button color="success" outline onClick={this.notifyBottomLeft}>
              Bottom Left
            </Button>
          </div>
          <div className="d-inline-block mr-1 mb-1">
            <Button color="success" outline onClick={this.notifyBottomCenter}>
              Bottom Center
            </Button>
          </div>
          <div className="d-inline-block mb-1">
            <Button color="success" outline onClick={this.notifyBottomRight}>
              Bottom Right
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default ToastrPositions;
