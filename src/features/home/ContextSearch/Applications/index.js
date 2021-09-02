import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {selectdForms} from 'app/selectors'

import { Scrollbars } from 'react-custom-scrollbars';
import {
  Row,
  Col,
} from 'reactstrap'

import ListItem from 'features/home/ContextSearch/components/ListItem'

import './styles.scss'

import WorkFlowsAndNotificationsList from "features/home/ContextSearch/components/WorkFlowsAndNotificationsList";

import onboardingSlice from 'app/slices/onboardingSlice';
import appSlice from 'app/slices/appSlice'

const {
  setdForm,
} = onboardingSlice.actions;

const {
  setContext,
} = appSlice.actions;

const Applications = () => {
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);

  const dForms = useSelector(selectdForms);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    dispatch(setdForm(item));
    dispatch(setContext("dForm"))
  };

  return (
    <Row style={{marginBottom: "40px"}}>
      <Col className="applications">
        <div className="list-header">
          <div>
            Name
          </div>
          <div>
            Description
          </div>
          <div>
            Organisations
          </div>
        </div>

        <Scrollbars  autoHeight autoHeightMax={500}>
          <div className="items-list">
            {!!dForms.length && dForms.map((item, index) => (
              <ListItem
                key={index}
                item={item}
                onClick={() => {handleItemSelect(item)}}
                isSelected={selectedItem && selectedItem.id === item.id}
              />
            ))}
          </div>
        </Scrollbars>
      </Col>

      <WorkFlowsAndNotificationsList context="dForm" />

    </Row>
  )
};

export default Applications;
