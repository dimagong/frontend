import React, { useMemo } from "react";
import { each as _each } from "lodash";

import { NmpSelect } from "features/nmp-ui";

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

export const GroupChanger = (props) => {
  const { id, data, element, ...otherProps } = props;

  const groups = useMemo(() => getGroupIds(data), [data]);
  const groupsAsOptions = groups.map((group) => optionHandler(group));

  return <NmpSelect id={id} options={groupsAsOptions} placeholder="Select an option" {...otherProps} />;
};
