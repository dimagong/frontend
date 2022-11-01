import React, { useMemo } from "react";
import { each as _each } from "lodash";

import { NmpSelect } from "features/nmp-ui";

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

export const SectionChanger = (props) => {
  const { id, data, group, ...otherProps } = props;

  const sections = useMemo(() => getSections(data), [data]);
  const sectionsAsOptions = sections.map((section) => optionHandler(section));

  return (
    <NmpSelect id={id} isSearchable={true} options={sectionsAsOptions} placeholder="Select an option" {...otherProps} />
  );
};
