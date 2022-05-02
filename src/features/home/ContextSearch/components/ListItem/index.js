import React from "react";

const ListItem = ({ item, index, onClick, isSelected }) => {
  return (
    <div className={`list_item ${isSelected ? "selected" : ""}`} key={`${item.name} ${index}`} onClick={onClick}>
      <div className="list_item_name">{item.name}</div>
      <div className="list_item_description">{item.description}</div>
      <div className="list_item_organizations">
        {item.groups && item.groups.map((group) => <div key={group.name}>{group.name}</div>)}
      </div>
    </div>
  );
};

export default ListItem;
