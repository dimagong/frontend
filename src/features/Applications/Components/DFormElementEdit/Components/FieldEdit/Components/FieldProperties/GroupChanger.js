import { NmpSelect } from "features/nmp-ui";
import React, { useEffect, useMemo } from "react";
import { each as _each } from "lodash";

const getGroupIds = (schema, element, title) => {
  let groups = [];

  _each(schema.sections, (section) => {
    _each(section.relatedGroups, (groupId) => {
      // todo temporary
      const elementName = title || "<current field>";

      groups.push({
        id: groupId,
        breadcrumbs: `${section.name}.${schema.groups[groupId].name}.${elementName}`,
      });
    });
  });

  return groups;
};

const optionHandler = (group) => {
  return { label: group.breadcrumbs, value: group.id };
};

const GroupChanger = (props) => {
  const { id, data, element, title, ...otherProps } = props;
  const groups = useMemo(() => getGroupIds(data, element, title), [data, title]);

  return (
    <NmpSelect
      id={id}
      options={groups.map((group) => optionHandler(group))}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default GroupChanger;
