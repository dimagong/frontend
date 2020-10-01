import React from "react";
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
import { X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectNotification } from "app/selectors/onboardingSelectors";
import { setNotification, setNotificationGroups } from "app/slices/onboardingSlice";
import {MultiSelect} from "components/MultiSelect/multiSelect";
import {prepareSelectGroups} from "utility/select/prepareSelectData";
import { createNotificationRequest, updateNotificationRequest } from "app/slices/appSlice";

const NotificationsForm = ({ clearGridSelection, isCreate }) => {
  const notification = useSelector(selectNotification);
  const { name, description, content } = notification || {};
  const dispatch = useDispatch();

  const closeNotification = () => {
    clearGridSelection();
    dispatch(setNotification(null));
  };

  const handleNotification = (notificationValue) => {
    dispatch(setNotification({ ...notification, ...notificationValue }));
  };
  
  const submitNotification = (e) => {
    e.preventDefault();
    if(isCreate.current){
      dispatch(createNotificationRequest(notification))
    }else{
      dispatch(updateNotificationRequest(notification)) 
    }
  }
  return (
    <Col sm="6">
        <Col col="md-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-weight-bold">Notification</CardTitle>
              <X
                size={15}
                className="cursor-pointer"
                onClick={() => closeNotification()}
              />
            </CardHeader>
            <CardBody className="card-top-padding">
              <Form className="mt-1" onSubmit={submitNotification}>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(event) =>
                      handleNotification({ name: event.target.value })
                    }
                    type="text"
                    name="name"
                    placeholder="Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    value={description}
                    onChange={(event) =>
                      handleNotification({ description: event.target.value })
                    }
                    type="textarea"
                    name="description"
                    placeholder="Description"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Content</Label>
                  <Input
                    value={content}
                    onChange={(event) =>
                      handleNotification({ content: event.target.value })
                    }
                    type="textarea"
                    name="content"
                    placeholder="Content"
                  />
                </FormGroup>
                <MultiSelect
                  setGroups={setNotificationGroups}
                  groups={prepareSelectGroups(notification.groups)}
                />
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button
                    color="primary d-flex-left"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
    </Col>
  );
};

export default NotificationsForm;
