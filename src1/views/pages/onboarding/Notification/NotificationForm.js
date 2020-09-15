import React, { Component } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Col,
    Input,
    Form,
    Button,
    Label,
} from "reactstrap";
import MultiSelect from "components/MultiSelect/multiSelect";
import {  X } from "react-feather"

export class NotificationForm extends Component {
    
  render() {
    return this.state.notificationEdit ? (
      <Col col="md-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-weight-bold">Notification</CardTitle>
            <X
              size={15}
              className="cursor-pointer"
              onClick={() => this.closeNotification()}
            />
          </CardHeader>
          <CardBody className="card-top-padding">
            <Form className="mt-1">
              <FormGroup>
                <Label>Name</Label>
                <Input
                  value={this.state.notificationTemplate.name}
                  onChange={(event) =>
                    this.setState({
                      notificationTemplate: {
                        ...this.state.notificationTemplate,
                        name: event.target.value,
                      },
                    })
                  }
                  type="text"
                  name="name"
                  placeholder="Name"
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  value={this.state.notificationTemplate.description}
                  onChange={(event) =>
                    this.setState({
                      notificationTemplate: {
                        ...this.state.notificationTemplate,
                        description: event.target.value,
                      },
                    })
                  }
                  type="textarea"
                  name="description"
                  placeholder="Description"
                />
              </FormGroup>
              <FormGroup>
                <Label>Content</Label>
                <Input
                  value={this.state.notificationTemplate.content}
                  onChange={(event) =>
                    this.setState({
                      notificationTemplate: {
                        ...this.state.notificationTemplate,
                        content: event.target.value,
                      },
                    })
                  }
                  type="textarea"
                  name="content"
                  placeholder="Content"
                />
              </FormGroup>
              <MultiSelect ref={this.multiSelectRef} />
              <div className="d-flex justify-content-center flex-wrap mt-2">
                <Button
                  color="primary d-flex-left"
                  onClick={() => this.submitNotification()}
                >
                  Save
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    ) : null;
  }
}

export default NotificationForm;
