import React from "react"
import {
  Form, FormGroup, Label, Input, Row, Col, Button, CardBody, Card, CardHeader,
  CardTitle, Spinner
} from "reactstrap"
import {
  Link,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Codepen,
  Slack,
  RotateCw
} from "react-feather"
import axios from '../../../../overrides/axios'
import moment from 'moment'
import classnames from "classnames"

class Stats extends React.Component {

  state = {
    usersOnline: [
      {
        name: 'Barbara Shaun',
        role: 'Advisor'
      }
    ],
    usersActivity: [
      {
        invite_accepted_by: '',
        invited_user_by: '',
        new_user: '',
      }
    ],
    InfoReload: false
  }

  async componentDidMount() {
    const response = await axios.get('/api/stats');
    this.setState({ ...response.data })
  }

  refreshCard = async () => {
    this.setState({ InfoReload: true })
    const response = await axios.get('/api/stats');
    this.setState({ ...response.data })
    this.setState({ InfoReload: false })
  }

  render() {
    return (
      <Card
        className={classnames("card-reload card-action", {
          refreshing: this.state.InfoReload
        })}>
        <CardHeader>
          <CardTitle>Last Activity</CardTitle>
          <RotateCw size={15} onClick={this.refreshCard} />
        </CardHeader>
        <CardBody>
          {this.state.InfoReload ? (
            <Spinner color="primary" className="reload-spinner" />
          ) : (
              ""
            )}
          <Row>
            <Col md="12">
              <div className="">
                <h5>Currently online ({this.state.countUsersOnline}/{this.state.countUsers})</h5>
                {
                  this.state.usersOnline.map(user => {
                    return (<Row>
                      <Col md="5">
                        <div className="user-info-title font-weight-bold">{user.name}</div>
                      </Col>
                      <Col md="5">
                        <div>
                          {user.roles && user.roles.map(role => {
                            return <div style={{ width: '100%' }} className="float-left">{role.name}</div>
                          })}
                        </div>
                      </Col>
                      <Col md="2">
                        {/* <div>M V</div> */}
                      </Col>
                    </Row>)
                  })
                }
              </div>
            </Col>
            <Col md="12">
              <div className="mt-2">
                <h5>Latest user activity</h5>
                {
                  this.state.lastAcceptedInvitation && this.state.lastAcceptedInvitation.accepted_at &&
                  <Row>
                    <Col md="5">
                      <div className="user-info-title font-weight-bold">Invite accepted:</div>
                    </Col>
                    <Col md="4">
                      <div>{this.state.lastAcceptedInvitation.invited_user.name}</div>
                    </Col>
                    <Col md="3">
                      <div>{moment().to(this.state.lastAcceptedInvitation.accepted_at)}</div>
                    </Col>
                  </Row>
                }

                {
                  this.state.lastInvitedUser &&
                  <Row>
                    <Col md="5">
                      <div className="user-info-title font-weight-bold">User invited:</div>
                    </Col>
                    <Col md="4">
                      <div>{this.state.lastInvitedUser.invited_user.name}</div>
                    </Col>
                    <Col md="3">
                      <div>{moment().to(this.state.lastInvitedUser.created_at)}</div>
                    </Col>
                  </Row>
                }
                {
                  this.state.newUser &&
                  <Row>
                    <Col md="5">
                      <div className="user-info-title font-weight-bold">New user:</div>
                    </Col>
                    <Col md="4">
                      <div>{this.state.newUser.name}</div>
                    </Col>
                    <Col md="3">
                      <div>{moment().to(this.state.newUser.created_at)}</div>
                    </Col>
                  </Row>
                }
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

    )
  }
}
export default Stats
