import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody, Col, Row, Badge } from "reactstrap";
import { X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { selectNotifications } from "app/selectors/onboardingSelectors";
import { selectPreview } from "app/selectors/layoutSelector";

import onboardingSlice from "app/slices/onboardingSlice";
import appSlice from "app/slices/appSlice";

const { setNotification } = onboardingSlice.actions;

const { setPreview } = appSlice.actions;

const initNotification = { name: "", description: "", content: "", groups: [] };

const NotificationsFormPreview = ({ isCreate }) => {
  const preview = useSelector(selectPreview);
  const notifications = useSelector(selectNotifications);

  const dispatch = useDispatch();

  const notification = notifications.filter(({ id }) => id === preview.id)[0];

  const closeNotification = () => {
    dispatch(setPreview(null));
  };

  useEffect(() => {
    if (isCreate) {
      dispatch(setNotification(initNotification));
    }
  }, [isCreate]);

  if (!notification) return null;

  return (
    <Row>
      <Col sm="8">
        <Card className="border">
          <CardHeader>
            <CardTitle className="font-weight-bold">Notification</CardTitle>
            <X size={15} className="cursor-pointer" onClick={() => closeNotification()} />
          </CardHeader>
          <CardBody className="card-top-padding">
            <Row>
              <Col>
                <div className="mt-2">
                  <div className="d-flex mb-1 align-items-center">
                    <div className="width-100">Organisations</div>
                    {notification.groups && notification.groups.length ? (
                      notification.groups.map((group) => (
                        <Badge className="custom-badge" color="primary">
                          {group.name}
                        </Badge>
                      ))
                    ) : (
                      <span>No roles</span>
                    )}
                  </div>
                </div>
                <div className="d-flex mb-1">
                  <div className="font-weight-bold-lighter column-sizing-user-info width-100">Name</div>
                  <div className="user-managment__edit_body_user-info-container">
                    <div className=" user-managment__edit_body_form_text">
                      <span>{notification.name} </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex mb-1">
                  <div className="font-weight-bold-lighter column-sizing-user-info width-100">Description</div>
                  <div className="user-managment__edit_body_user-info-container">
                    <div className=" user-managment__edit_body_form_text">
                      <span>{notification.description} </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default NotificationsFormPreview;
