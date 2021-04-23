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

const { getActivitiesRequest } = appSlice.actions;


const Timeline = ({managerId}) => {
  const dispatch = useDispatch();

  const data = useSelector(selectUserActivity(managerId));
  const [showedActivitiesSize, setShowedActivitiesSize] = useState(4);

  const getTimePassed = (inputTime) => {
    let time = moment(inputTime);
    return time.format('L') + ' ' + time.format('LT');
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
              <th className={'activity-by'}>Action caused by</th>
            </tr>
            {data && data.slice(0).reverse().map((item, index) => {
              return <tr>
                <td>{getTimePassed(item.created_at)}</td>
                <td>{item.description}</td>
                <td>{item.recipient.first_name + ' ' + item.recipient.last_name}</td>
              </tr>
            })
            }
        </table>
      </CardBody>
    </Card>
  )
}


export default Timeline;
