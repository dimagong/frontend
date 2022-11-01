import { NmpSelect } from "features/nmp-ui";
import React, { useEffect, useMemo } from "react";
import { each as _each } from "lodash";

const getGroupIds = (schema) => {
  let groups = [];

  _each(schema.sections, (section) => {
    _each(section.relatedGroups, (groupId) => {
      groups.push({
        id: groupId,
        breadcrumbs: `${section.name}.${schema.groups[groupId].name}`,
      });
    });
  });

  return groups;
};

const optionHandler = (group) => {
  return { label: group.breadcrumbs, value: group.id };
};

const GroupChanger = (props) => {
  const { id, data, element, ...otherProps } = props;
  const groups = useMemo(() => getGroupIds(data), [data]);

  return (
    <NmpSelect
      id={id}
      isSearchable={true}
      options={groups.map((group) => optionHandler(group))}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default GroupChanger;
