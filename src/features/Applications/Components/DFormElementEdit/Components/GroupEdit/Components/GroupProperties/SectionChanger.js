import { NmpSelect } from "features/nmp-ui";
import React, { useEffect, useMemo } from "react";
import { each as _each } from "lodash";

const getSections = (schema) => {
  let sections = [];

  _each(schema.sections, (section) => {
    sections.push({
      id: section.id,
      breadcrumbs: `${section.name}`,
    });
  });

  return sections;
};

const optionHandler = (section) => {
  return { label: section.breadcrumbs, value: section.id };
};

const SectionChanger = (props) => {
  const { id, data, group, ...otherProps } = props;
  const sections = useMemo(() => getSections(data), [data]);

  return (
    <NmpSelect
      id={id}
      isSearchable={true}
      options={sections.map((section) => optionHandler(section))}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default SectionChanger;
