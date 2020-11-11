import React, {useEffect} from "react";
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
  Row,
} from "reactstrap";
import {X} from "react-feather";
import {useDispatch, useSelector} from "react-redux";
import {selectNotification} from "app/selectors/onboardingSelectors";
import {setNotification, setNotificationGroups} from "app/slices/onboardingSlice";
import {MultiSelect} from "components/MultiSelect/multiSelect";
import {prepareSelectGroups} from "utility/select/prepareSelectData";
import {createNotificationRequest, setContext, updateNotificationRequest} from "app/slices/appSlice";

const initNotification = {name: '', description: "", content: "", groups: []};

const NotificationsForm = ({isCreate}) => {
  const notification = useSelector(selectNotification);
  const {name, description, content} = notification || {};
  const dispatch = useDispatch();

  const closeNotification = () => {
    dispatch(setContext(null));
    dispatch(setNotification(null));
  };

  const handleNotification = (notificationValue) => {
    dispatch(setNotification({...notification, ...notificationValue}));
  };

  const submitNotification = (e) => {
    e.preventDefault();
    if (isCreate) {
      dispatch(createNotificationRequest(notification))
    } else {
      dispatch(updateNotificationRequest(notification))
    }
  };

  useEffect(() => {
    if (isCreate) {
      dispatch(setNotification(initNotification))
    }
  }, [isCreate]);

  if (!notification) return null;

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xl="7">
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
                    handleNotification({name: event.target.value})
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
                    handleNotification({description: event.target.value})
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
                    handleNotification({content: event.target.value})
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
    </Row>
  );
};

export default NotificationsForm;
