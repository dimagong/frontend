import React, {useEffect, useState} from 'react'
import {
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'

import ArrowBoldUp from 'assets/img/icons/arrow-bold-up.png'
import CheckMarkSuccess from 'assets/img/icons/checkmark3.png'
import { Scrollbars } from 'react-custom-scrollbars'
import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";
import {selectUserActivity} from "../../app/selectors/userSelectors";

const { getActivitiesRequest } = appSlice.actions;


const Timeline = ({managerId}) => {
  const dispatch = useDispatch();

  const Delimiter = () => (
    <div className="timeline-component_item timeline-component_item-delimiter">
      <div className="vertical-delimiter"/>
    </div>
  )

  const icons = {
    success: {
      icon: CheckMarkSuccess,
      iconStyles: {},
    },
    upload: {
      icon: ArrowBoldUp,
      iconStyles: {},
    }
  }

  const data = useSelector(selectUserActivity(managerId));
  const [showedActivitiesSize, setShowedActivitiesSize] = useState(4);

  const addData = (scroll) => {
    if (scroll.top > 0.95) {
      /*let newData = [];
      data.forEach(item => newData.push(item));
      newData.push({
        status: "success",
        message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste magni obcaecati quos? Aliquid animi architecto corporis cupiditate dolor dolorem eligendi eos eveniet ex iste non, omnis optio perspiciatis rerum tenetur. ",
        icon: "upload",
        time: "5 days ago"
      });
      console.log('newData', newData);
      setData(newData);*/
      if (data.length > showedActivitiesSize) {
        setShowedActivitiesSize(showedActivitiesSize + 1);
      }
    }
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

  console.log('showedActivitiesSize', showedActivitiesSize);
  return (
    <Card>
      <CardBody>
        <Scrollbars autoHeight autoHeightMax={500} onScrollFrame={addData}>
          <div className="timeline-component">

            <div className="timeline-component_item">
              <div className="left">
                <div className="start" >Now</div>
              </div>
            </div>
            <Delimiter />
            {data && data.slice(0, showedActivitiesSize).map((item, index) => {
              return (
                <>
                  <div key={index} className="timeline-component_item">
                    <div className="left">
                      {item.time}
                    </div>
                    <div className="center">
                      <div className="horizontal-delimiter">
                        <div className={`status-circle status-${item.status || "success"}`} />
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-content">
                        <div className="icon">
                          <img src={icons[item.icon].icon} alt="icon"/>
                        </div>
                        <div className="description">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Delimiter />
                </>
              )
            })}

          </div>
        </Scrollbars>
      </CardBody>
    </Card>
  )
}


export default Timeline;
