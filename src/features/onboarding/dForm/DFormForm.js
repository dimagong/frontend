import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Row,
    Col,
    Button, Badge,
  } from "reactstrap";
  import {X, Eye, EyeOff} from "react-feather"
  import MultiSelect from "components/MultiSelect/multiSelect";

const DFormForm = () => {
    return (
        <Card>
        <CardHeader>
          <CardTitle className="font-weight-bold">DForm</CardTitle>
          <div>
            {
              this.state.isStateConfig ?
                <EyeOff size={15} className="cursor-pointer mr-1"
                        onClick={() => this.changeStateConfig(false)}/>
                :
                <Eye size={15} className="cursor-pointer mr-1"
                     onClick={() => this.changeStateConfig(true)}/>
            }
            <X size={15} className="cursor-pointer mr-1" onClick={() => this.closeDForm()}/>
          </div>

        </CardHeader>
        <CardBody className="card-top-padding">
          <div className="mt-2">
            <MultiSelect ref={this.multiSelectRef} groups={this.state.dFormTemplate.groups}/>
          </div>
          {/* <FormCreate fileLoader={false}
                      submitDForm={(dForm, data) => this.submitDForm(dForm, data)}
                      liveValidate={false}
                      isShowToggleProtectedProperties={true}
                      dForm={this.state.dFormTemplate}
                      isStateConfig={this.state.isStateConfig}
          ></FormCreate> */}
        </CardBody>
      </Card>
    )
}

export default DFormForm
