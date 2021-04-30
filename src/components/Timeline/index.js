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

const parseTextToComponent = (text) => {
  let indexes = [];
  let currIndex = -1;
  for (let i = 0; i < text.length; ++i) {
    if (text[i] === '<') {
      if (i + 1 < text.length && text[i + 1] === '/') {
        indexes[indexes.length - 1].finish = i;
      } else {
        indexes.push({start: i, finish: -1});
      }
    }
  }

  if (indexes.length === 0) {
    return <span>{text}</span>
  }

  return <span>
    {text.substring(0, indexes[0].start)}
    {indexes.map(i => {
      ++currIndex;
      return <span>
        <strong>{text.substring(i.start + 3, i.finish)}</strong>
        {text.substring(i.finish + 4, currIndex + 1 === indexes.length ? text.length : indexes[currIndex + 1].start)}
      </span>
    })}
  </span>

}


const Timeline = ({managerId}) => {
  const dispatch = useDispatch();

  const data = useSelector(selectUserActivity(managerId));

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
    let changedOptions = editData.options.filter(item => (item.old !== item.new) && (item.old || item.new) &&
      (item.type === 'first_name' || item.type === 'last_name' || item.type === 'email' || item.type === 'number'));

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
      {parseTextToComponent(messageParts.splice(0, index).join(' ') + ' ')}
      {newMessage}
    </td>
  }

  useEffect(() => {
    dispatch(getActivitiesRequest(managerId))
  }, [managerId]);


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
                  : <td>{parseTextToComponent(item.description)}</td>}
              </tr>
            })
            }
        </table>
      </CardBody>
    </Card>
  )
}


export default Timeline;
