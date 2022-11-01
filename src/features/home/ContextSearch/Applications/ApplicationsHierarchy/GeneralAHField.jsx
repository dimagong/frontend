import React from "react";
import PropTypes from "prop-types";
import { FiberManualRecord } from "@material-ui/icons";
import { CopyOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import { AHTreeNode } from "./AHTreeNode";
import { NmpButton } from "features/nmp-ui";
import { stopPropagation } from "utility/event-decorators";
import { useCopyApplicationTemplateMutation } from "features/data/applicationQueries";

import appSlice from "app/slices/appSlice";
import { toast } from "react-toastify";
const { setContext } = appSlice.actions;

export const GeneralAHField = (props) => {
  const { node, name, date, index, selected, isLocked, onSelect, className, children } = props;
  const dispatch = useDispatch();

  const copyApplicationTemplate = useCopyApplicationTemplateMutation(
    { applicationId: node?.id },
    {
      onSuccess: () => {
        dispatch(setContext("dForm"));
        toast.success("Application duplicated");
      },
      onError: (error) => {
        //TODO handle error
        console.error(error);
      },
    }
  );

  const onDuplicate = async () => {
    if (!window.confirm(`Are you sure you want to duplicate this template: ${node.name}?`)) {
      return;
    }

    await copyApplicationTemplate.mutateAsync();
  };

  return (
    <AHTreeNode
      className={className}
      name={
        <div className="tree-hierarchy__name-text w-75" title={name}>
          {name}
        </div>
      }
      date={date}
      index={index}
      selected={selected}
      isLocked={isLocked}
      onSelect={onSelect}
      prepend={
        <div className="tree-hierarchy__mark-icon d-flex justify-content-center align-items-center">
          <FiberManualRecord fontSize={"inherit"} />
        </div>
      }
      append={
        <div className="tree-hierarchy__duplicate mr-50">
          <NmpButton type="text" icon={<CopyOutlined />} onClick={stopPropagation(onDuplicate)} />
        </div>
      }
      children={children}
    />
  );
};

GeneralAHField.propTypes = {
  node: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  date: PropTypes.string,

  isLocked: PropTypes.bool.isRequired,

  onSelect: PropTypes.func,
  selected: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.node,
};
