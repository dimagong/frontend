import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";

const FileItem = ({ file, expandable, controls, ...attrs }) => {
  const expanded = React.useMemo(() => expandable.includes(file.id), [expandable, file.id]);

  const expand = () => expandable.setKeys([file.id]);

  return (
    <li className="mb-1" onClick={expand} {...attrs}>
      <div className="list_item selected mb-0" key={file.id}>
        <div className="list_item_name">{file.status}</div>
        <div className="list_item_description">{"v" + moment(file.created_at).format("YYYY.DD.MM HH:mm")}</div>
        <div className="list_item_description">0</div>
        <div className="list_item_description">{moment(file.updated_at).format("DD/MM/YYYY")}</div>
        <div className="list_item_description">{file.provided.first_name}</div>
      </div>

      <Collapse isOpen={expanded} aria-expanded={expanded.toString()}>
        <div className="d-flex justify-content-end pt-1 pb-2">{controls}</div>
      </Collapse>
    </li>
  );
};

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
  controls: PropTypes.node.isRequired,
};

export default FileItem;
