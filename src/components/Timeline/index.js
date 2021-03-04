import React from 'react'
import {
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'

import PerfectScrollbar from 'react-perfect-scrollbar'
import ArrowBoldUp from 'assets/img/icons/arrow-bold-up.png'
import CheckMarkSuccess from 'assets/img/icons/checkmark3.png'
import { Scrollbars } from 'react-custom-scrollbars'


const Timeline = () => {

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

  const data = [
    {
      status: "success",
      message: "Updated something",
      icon: "success",
      time: "3 days ago"
    },
    {
      status: "success",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste magni obcaecati quos? Aliquid animi architecto corporis cupiditate dolor dolorem eligendi eos eveniet ex iste non, omnis optio perspiciatis rerum tenetur. ",
      icon: "upload",
      time: "4 days ago"
    },
    {
      status: "success",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste magni obcaecati quos? Aliquid animi architecto corporis cupiditate dolor dolorem eligendi eos eveniet ex iste non, omnis optio perspiciatis rerum tenetur. ",
      icon: "upload",
      time: "4 days ago"
    },
    {
      status: "success",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste magni obcaecati quos? Aliquid animi architecto corporis cupiditate dolor dolorem eligendi eos eveniet ex iste non, omnis optio perspiciatis rerum tenetur. ",
      icon: "upload",
      time: "4 days ago"
    }
  ]

  return (
    <Card>
      <CardBody>
        <Scrollbars autoHeight autoHeightMax={500}>
          <div className="timeline-component">

            <div className="timeline-component_item">
              <div className="left">
                <div className="start" >Now</div>
              </div>
            </div>
            <Delimiter />
            {data.map((item, index) => {
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
