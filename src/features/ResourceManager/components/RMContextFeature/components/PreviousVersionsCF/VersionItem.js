import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";

const VersionItem = ({ version, expandable, controls, ...attrs }) => {
  const expanded = React.useMemo(() => expandable.includes(version.id), [expandable, version.id]);

  const expand = () => expandable.setKeys([version.id]);

  return (
    <li className="expandable_item_container mb-1" onClick={expand} {...attrs}>
      <div className="list_item selected mb-0" key={version.id}>
        <div className="list_item_name">{version.status}</div>
        <div className="list_item_description">{"v" + moment(version.created_at).format("YYYY.DD.MM HH:mm")}</div>
        <div className="list_item_description">0</div>
        <div className="list_item_description">{moment(version.updated_at).format("DD/MM/YYYY")}</div>
        <div className="list_item_description">{version.provided.first_name}</div>
      </div>

      <Collapse isOpen={expanded} mountOnEnter unmountOnExit aria-expanded={expanded.toString()}>
        <div className="list_actions d-flex justify-content-end pt-1 pb-2">{controls}</div>
      </Collapse>
    </li>
  );
};

VersionItem.propTypes = {
  version: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
  controls: PropTypes.node.isRequired,
};

export default VersionItem;
