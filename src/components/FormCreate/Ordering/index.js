import React, {useState} from "react";
import OrderingEditModal from "./OrderingEditModal";
import {Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import Ordering from "./Ordering";


function FormOrdering(props) {
  const [filterSectionName, setFilterSectionName] = useState(null);
  const [filterGroupName, setFilterGroupName] = useState(null);

  const onOpenSortableModal = () => {

  };


  const onSaveSortableModal = () => {

  };

  return (
    <div>
      <OrderingEditModal onOpen={() => onOpenSortableModal()} onSave={() => onSaveSortableModal()}>
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
          </CardHeader>
          <CardBody>
            <Ordering
              isItemsArray={false}
              selfKey={filterSectionName} items={props.sections}
              onChangeFilterKey={(filterKey) => {
                setFilterSectionName(filterKey);
                setFilterGroupName(null);
              }}
              onDragEnd={(items) => {
                props.onChangeSections(items);
              }}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Groups</CardTitle>
          </CardHeader>
          <CardBody>
            <Ordering
              isItemsArray={false}
              selfKey={filterGroupName}
              filterControlled={true}
              filterKey={filterSectionName}
              onChangeFilterKey={(filterKey) => {
                setFilterGroupName(filterKey);
              }}
              items={props.groups}
              onDragEnd={(items) => {
                props.onChangeGroups(items);
              }}/>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
          </CardHeader>
          <CardBody>
            <Ordering
              isItemsArray={true}
              filterControlled={true}
              filterKey={filterGroupName}
              filterItems={props.fieldsFilter}
              items={props.fields}
              onDragEnd={(items) => {
                props.onChangeFields(items);
              }}
              isMsField={true}
            />
          </CardBody>
        </Card>
      </OrderingEditModal>
    </div>
  );
}

export default FormOrdering;
