import React from 'react'
import {CardHeader, CardBody, Card, CardTitle, Row, Col, Spinner, TabContent, TabPane, Nav, NavItem, NavLink, UncontrolledTooltip} from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import {selectProfile} from "app/selectors";
import classnames from "classnames"
import {toast, ToastContainer} from 'react-toastify';
import { isEmpty } from 'lodash'
import FormCreate from 'components/FormCreate/FormCreate'

const OnboardingUser = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const isOnboarding = () => {
    return profile.user && profile.user.onboardings && profile.user.onboardings.length
  }

    return (
      <div>
        {
          isOnboarding()
            ? (
            <Row>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Nav pills className="nav-justified">
                  {
                    profile.onboardings.map(onboarding => {
                      return (
                        <NavItem>
                          <NavLink
                            disabled={this.state.isSaving}
                            className={classnames({
                              active: this.state.active === onboarding.id
                            })}
                            onClick={() => {
                              this.toggle(onboarding.id);
                              this.setState({selectedOnboarding: onboarding})
                              this.reInitForm && this.reInitForm();
                            }}
                          >
                            {onboarding.d_form.name} {this.getStatus(onboarding.d_form.id, onboarding.d_form.status)}
                          </NavLink>
                        </NavItem>
                      );
                    })
                  }
                </Nav>
              </Col>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Card>
                  {/*<CardHeader>*/}
                  {/*  <CardTitle>Onboarding</CardTitle>*/}
                  {/*</CardHeader>*/}
      
                  <CardBody className="pt-1">
                    {
                      this.props.user && this.props.user.onboardings && this.props.user.onboardings.length ?
                        <div>
                          <TabContent activeTab={this.state.active}>
                            {
                              this.props.user.onboardings.map(onboarding => {
                                return (
                                  <TabPane tabId={onboarding.id}>
      
                                  </TabPane>
                                );
                              })
                            }
                          </TabContent>
                        </div>
                        :  'Onboarding not exist'
                    }
      
                    {!isEmpty(this.state.selectedOnboarding) 
                    ?  this.state.selectedOnboarding.d_form.access_type === 'user-lock' 
                      ? <FormCreate
                        reInit={(reInit, context) => {
                          this.reInitForm = reInit.bind(context)
                        }}
                        // isShowProtectedElements={userService.isShowProtectedElements(this.props.user)}
                        fileLoader={true}
                        inputDisabled={true}
                        fill={true}
                        dForm={this.state.selectedOnboarding.d_form}
                        onSaveButtonHidden={this.isDisabledSubmit()}
                        isStateConfig={false}
                      ></FormCreate>
                      : <FormCreate
                        reInit={(reInit, context) => {
                          this.reInitForm = reInit.bind(context)
                        }}
                        // isShowProtectedElements={userService.isShowProtectedElements(this.props.user)}
                        onSubmit={(formData) => this.submitOnboardingForm(formData)}
                        fileLoader={true}
                        inputDisabled={false}
                        fill={true}
                        dForm={this.state.selectedOnboarding.d_form}
                        onSaveButtonHidden={true}
                        onChange={(formData) => {
                          this.setState({isSaving: true});
                          this.debounceOnSave(formData)
                        }}
                        updatedAtText={this.state.updatedAtText ? this.state.updatedAtText : this.getDefaultUpdatedAtText()}
                        isStateConfig={false}
                      ></FormCreate>
                     : null}
                    {/*{*/}
                    {/*  Object.keys(this.props.user).length ?*/}
      
                    {/*    isEmpty(this.state.selectedOnboarding) ?*/}
                    {/*      null*/}
                    {/*      :*/}
                    {/*      this.onboardingProcess()*/}
                    {/*    : 'loading..'*/}
                    {/*}*/}
                  </CardBody>
                </Card>
              </Col>
              <ToastContainer></ToastContainer>
            </Row>
            )
             : 'Onboarding not exist'
        }
      </div>
    )
  }



export default OnboardingUser;
