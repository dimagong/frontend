import React, {useEffect, useState} from 'react'
import {
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'
import moment from "moment";

import {useSelector} from "react-redux";
import {OverlayTrigger, Tooltip, Button} from "react-bootstrap";
import {userProfileUpdated} from "constants/activity";
import SpinnerIcon from 'assets/img/svg/spinner.svg';
import {selectLoading} from 'app/selectors';


export const parseTextToComponent = (text) => {
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

export const getEditMessage = (editData) => {
    let messageParts = editData.description.split(' ');
    let index = messageParts.findIndex(item => item[0] === '%');

    if (!editData.options) {
      return null;
    }
    let optionsData = [];
    if (!Array.isArray(editData.options)) {
      if (editData.options.hasOwnProperty('data')) {
        optionsData = editData.options.data
      } else {
        for (let i = 0; i < Object.keys(editData.options).length - 1; ++i) {
          if (editData.options[i]) {
            optionsData.push(editData.options[i])
          }
        }
      }
    } else {
      optionsData = [editData.options]
    }
    let changedOptions = optionsData.filter(item => (item.old !== item.new) && (item.old || item.new) &&
      (item.type === 'first_name' || item.type === 'last_name' || item.type === 'email' || item.type === 'number'));

    if (changedOptions.length === 0) {
      return null;
    }

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
        <span className={'activity-profile-update'}><strong>{changedOptions[i].name.toLowerCase()}</strong></span>
      </OverlayTrigger>{addBreaker}</span>)
      }

    return <span>
      {parseTextToComponent(messageParts.splice(0, index).join(' ') + ' ')}
      {newMessage}
    </span>
  }


const Timeline = ({activity, loadMoreData, noActivitiesMessage = "This manager has no activities yet"}) => {
  let data = activity?.data

  const isLoadingData = useSelector(selectLoading)

  const getTimePassed = (inputTime) => {
    let time = moment(inputTime);
    return time.format('L') + ' ' + time.format('LT');
  }

  if ((data && data.length === 0) || !activity) {
    return (
      <h1 className={'no-activities'}>
        {noActivitiesMessage}
      </h1>
    )
  }
  return (
    <Card>
      <CardBody>
          <table className={'activity-table'}>
            <tr>
              <th className={'activity-date'}>Date time</th>
              <th className={'activity-action'}>Action</th>
            </tr>
            {data && data.slice().sort((lhs, rhs) => new Date(lhs.created_at) > new Date(rhs.created_at) ? -1 : 1).map((item, index) => {
              let message = item?.action_type?.name === userProfileUpdated ? getEditMessage(item) : '';
              if (item?.action_type?.name !== userProfileUpdated || message) {
                return <tr>
                  <td>{getTimePassed(item.created_at)}</td>
                  {item?.action_type?.name === userProfileUpdated
                    ? <td>{message}</td>
                    : <td>{parseTextToComponent(item.description)}</td>}
                </tr>
              }
            })
            }
        </table>
        {activity?.next_page_url &&
        <div className={'activity-load-more'}>
          {isLoadingData ?
            <img src={SpinnerIcon} alt={'spinner'}/> :
            <Button onClick={loadMoreData}>Load more</Button>
          }

        </div>}
      </CardBody>
    </Card>
  )
}


export default Timeline;
