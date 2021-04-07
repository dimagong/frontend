import React, { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Row,
    Col,
    Input,
    Form,
    Button,
    Label,
    FormFeedback
  } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import { selectError, selectInvitation } from "app/selectors";
import { useDispatch, useSelector } from "react-redux";
import { getInvitationRequest, sendInvitationAcceptRequest } from 'app/slices/appSlice'
import { useRouter } from 'hooks/useRouter';
import TermsAndConditions from 'assets/ValidPath-privacy-policy.pdf'

const Invitation = () => {
    const errors = useSelector(selectError) || {};
    const invitation = useSelector(selectInvitation);
    const [invitationAccept, setInvitationAccept] = useState({});
    const dispatch = useDispatch();
    const {query} = useRouter()
    const {invitationId}  = query;

    useEffect(() => {
      dispatch(getInvitationRequest({invitationId}))
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
      dispatch(sendInvitationAcceptRequest({data:{invitation_token: invitationId, ...invitationAccept, code: ''}}))

    }

    const onPasswordChange = (event) => {
        setInvitationAccept({
            ...invitationAccept,
            password: event.target.value
        })
      }

      const onPasswordConfirmationChange = (event) => {
        setInvitationAccept({
            ...invitationAccept,
            password_confirmation: event.target.value
        })
      }

    const confirmCode = () => {

    }
    return (
        <Row className="m-0 justify-content-center">
        <Col
          sm="12"
          xl="5"
          lg="6"
          md="6"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="12" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Welcome to ValidPath Portal</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                      Please enter a password
                  </p>
                  <CardBody className="pt-1">
                    <Form action="/" >
                      <FormGroup className="form-label-group position-relative">
                        <Input
                          value={invitationAccept.password}
                          onChange={onPasswordChange}
                          type="password"
                          placeholder="Password"
                          required
                          {...{invalid: errors['password']}}
                        />
                        <Label>Password</Label>
                        <FormFeedback>{errors['password']}</FormFeedback>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative">
                        <Input
                          value={invitationAccept.password_confirmation}
                          onChange={onPasswordConfirmationChange}
                          type="password"
                          placeholder="Password confirmation"
                          required
                          {...{invalid: errors['password_confirmation']}}
                        />

                        <Label>Password confirmation</Label>
                        <FormFeedback>{errors['password_confirmation']}</FormFeedback>
                      </FormGroup>
                      <div className="d-flex justify-content-between">
                        <p style={{margin: "auto 0"}}>
                          By clicking Submit, you agree to our <a href={TermsAndConditions} target="_blank" rel='noopener noreferrer'>Privacy and Terms</a>
                        </p>
                        <Button color="primary" type="submit" onClick={onSubmit}>
                          Submit
                        </Button>
                      </div>
                    </Form>

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <SweetAlert title="Code Verification"
                    input
                    show={false}
                    placeHolder="Your code"
                    onConfirm={(response) => confirmCode(response)}
        >
          <p className="sweet-alert-text">
            Please check your email address and enter the code
          </p>
        </SweetAlert>
      </Row>
    )
}

export default Invitation