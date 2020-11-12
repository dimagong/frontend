import React, {useState, useRef, useEffect} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Form,
  Media,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Badge,
} from "reactstrap"
import DataTable from "react-data-table-component"
import classnames from "classnames"
import {User, X} from "react-feather"

import { useDispatch, useSelector } from "react-redux";
import {
  selectGroups,
  selectUserDForms,
  selectUserWorkfows, selectUserReviewers, selectManagers
} from "app/selectors";
import {
  getUserOnboardingRequest
} from "app/slices/appSlice";
import {columnDefs} from '../userOnboarding/gridSettings'

import {setPreview} from 'app/slices/appSlice'
import {selectPreview} from '../../../app/selectors/layoutSelector'
import noneAvatar from '../../../assets/img/portrait/none-avatar.png'
import {getGroupName} from '../../../utility/select/prepareSelectData'
import {groupTypes} from '../../../constants/group'

const UserEditPreview = (props, context) => {

  const preview = useSelector(selectPreview);
  const groups = useSelector(selectGroups)
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers)
  const [activeTab, setActiveTab] = useState("1")
  const dForms = useSelector(selectUserDForms)
  const workflows = useSelector(selectUserWorkfows)
  const reviewers = useSelector(selectUserReviewers)

  const manager = managers.filter(({ id }) => id === preview.id)[0]

  const initOnboarding = {
    d_form: null,
    is_internal: false,
    reviewers: [],
    user_id: manager.id,
    workflow: null,
  }

  useEffect(()=>{
    if(!dForms.length && !reviewers.length && !workflows.length){
    } dispatch(getUserOnboardingRequest())
  }, [])

  const removeCard = () => {
    dispatch(setPreview(null))

  }

  return (
    <Row className="user-managment">
      <Col sm="12" md="12" lg="12" xl="12" className={"pt-4"}>
        <Card className={"card-action user-managment__edit border mb-1"}>
          <CardHeader>
            <CardTitle className="font-weight-bold">
              Preview
            </CardTitle>
            <X size={15} onClick={removeCard}/>
          </CardHeader>
          <CardBody className="user-managment__edit_body">

            <Form onSubmit={() => {}}>
              <Row className="mx-0" col="12">
                <Col className="pl-0" sm="12">
                  <Media className="d-sm-flex d-block">
                    <Media left className="user-edit__user-avatar mt-md-1 mt-0 mr-1">
                      <Media
                        className="rounded"
                        object
                        src={
                          manager.url
                            ?  manager.url
                            : noneAvatar
                        }
                        alt="Generic placeholder image"
                        height="70"
                        width="70"
                      />
                    </Media>
                    <div style={{    alignSelf: "center", fontWeight: "bold", fontSize: "18px"}}>{manager.first_name}</div>
                  </Media>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Media className="edit-clicked" body>
                    <Row className="mt-1">
                      <Col md="12" lg="12" className="mt-md-2 mt-lg-0 mb-sm-2">
                        <div className="user-managment__edit_body_form__select-wrapper">
                          <div className="user-managment__edit_body_form__select mb-1">
                            <div className="font-weight-bold column-sizing">Roles</div>
                            <div className="full-width">
                              {manager.roles && manager.roles.length ? (
                                manager.roles.map((role) =>
                                  <Badge className="custom-badge" color="primary">
                                    {role}
                                  </Badge>
                                )
                              ) : (
                                <span>No roles</span>
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-1">
                            <div className="font-weight-bold column-sizing" style={{padding: 5}}>Organisations</div>
                            <div className="w-100">
                              {manager.groups && manager.groups.length ? (
                                manager.groups.map((group) =>
                                  <Badge className="custom-badge" color="primary">
                                    {getGroupName(groups, group.group_id, groupTypes[group.group_type])}
                                  </Badge>
                                )
                              ) : (
                                <span>No organizations</span>
                              )}
                            </div>
                          </div>
                          <div className="user-managment__edit_body_form__select">
                            <div className="font-weight-bold column-sizing">Modules</div>
                            <div className="full-width">
                              {manager.modules && manager.modules.length ? (
                                manager.modules.map((module) =>
                                  <Badge className="custom-badge" color="primary">
                                    {module.name}
                                  </Badge>
                                )
                              ) : (
                                <span>No modules</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Media>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "1"
                      })}
                      onClick={() => {
                        setActiveTab("1")
                      }}
                    >
                      <User size={16}/>
                      <span className="align-middle ml-50">Onboarding</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row className="mx-0" col="12">
                      <Col md="12" className="ml-0 pl-0">
                        <DataTable
                          data={manager.onboardings}
                          columns={columnDefs}
                          Clicked
                          onRowClicked={() => {}}
                          customStyles={{
                            cells: {
                              style: {
                                paddingLeft: '8px', // override the cell padding for data cells
                                paddingRight: '8px',
                              },
                            },
                          }}
                          conditionalRowStyles={[
                            {
                              when: row => manager.onboarding ? row.id === manager.onboarding.id : false,
                              style: row => ({
                                wordBreak: 'normal',
                                backgroundColor: '#007bff',
                                color: 'white'
                              }),
                            }
                          ]}
                          noHeader
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default UserEditPreview
