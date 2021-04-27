import React, {useEffect, useState} from 'react'
import {
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'
import moment from "moment";

import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";
import {selectUserActivity} from "app/selectors/userSelectors";
import {OverlayTrigger, Tooltip, Button} from "react-bootstrap";

const { getActivitiesRequest } = appSlice.actions;


const Timeline = ({managerId}) => {
  const dispatch = useDispatch();

  const data = useSelector(selectUserActivity(managerId));
  const [showedActivitiesSize, setShowedActivitiesSize] = useState(4);

  const getTimePassed = (inputTime) => {
    let time = moment(inputTime);
    return time.format('L') + ' ' + time.format('LT');
  }

  const getEditMessage = (editData) => {
    if (!editData.options) {
      return <td>{editData.description}</td>
    }

    let messageParts = editData.description.split(' ');
    let index = messageParts.findIndex(item => item[0] === '%');
    let changedOptions = editData.options.filter(item => (item.old !== item.new) && (item.old || item.new));

    let newMessage = [];
    for (let i = 0; i < changedOptions.length; ++i) {
      let addBreaker = '';
      switch (i) {
        case changedOptions.length - 2: {
          addBreaker = ' and '
          break;
        }
        case changedOptions.length - 1: {
          addBreaker = ' '
          break;
        }
        default: addBreaker = ', '
      }
      newMessage.push(<span><OverlayTrigger
        key={'top'}
        placement={'top'}
        overlay={
          <Tooltip id={`tooltip-top`}>
            Changed from <strong>{(changedOptions[i].old ? changedOptions[i].old : 'null') + ' '}</strong>
            to <strong>{changedOptions[i].new ? changedOptions[i].new: 'null'}</strong>
          </Tooltip>
        }
      >
        <span className={'activity-profile-update'}>{changedOptions[i].name.toLowerCase()}</span>
      </OverlayTrigger>{addBreaker}</span>)
      }

    return <td>
      {messageParts.splice(0, index - 1).join(' ') + ' '}
      {newMessage}
    </td>
  }

  useEffect(() => {
    dispatch(getActivitiesRequest(managerId))
    setShowedActivitiesSize(4);
  }, [managerId]);

  if (data && data.length < showedActivitiesSize) {
    setShowedActivitiesSize(data.length);
  }

  if (data && data.length === 0) {
    return <h1 className={'no-activities'}>This manager has no activities yet</h1>
  }

  return (
    <Card>
      <CardBody>
          <table className={'activity-table'}>
            <tr>
              <th className={'activity-date'}>Date time</th>
              <th className={'activity-action'}>Action</th>
            </tr>
            {data && data.slice(0).reverse().map((item, index) => {
              return <tr>
                <td>{getTimePassed(item.created_at)}</td>
                {item.action_type_id === 6
                  ? getEditMessage(item)
                  : <td>{item.description}</td>}
              </tr>
            })
            }
        </table>
      </CardBody>
    </Card>
  )
}


export default Timeline;
