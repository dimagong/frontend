import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import { NmpSelect } from "features/nmp-ui";
import CustomModal from "components/CustomModal";

import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";
import { parseOrganizationType } from "features/home/ContextSearch/Applications/utils/organizationTypeConverter";
import { useDFormTemplateCategoriesQuery } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";
import { NmpInput, NmpButton } from "features/nmp-ui";
import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";

export const EditCategoryModal = ({ isOpen, close, group, onSubmit: propOnSubmit, submitting }) => {
  const [name, setName] = useFormField(group.name, [Validators.required]);
  const [parentCategory, setParentCategory] = useState(null);
  const formGroup = useFormGroup({ name });

  const parentCategoryValue = parentCategory ? getCategoryAsOption(parentCategory) : null;

  let { data: categories, isSuccess } = useDFormTemplateCategoriesQuery({
    organizationId: group.organizationId,
    organizationType: parseOrganizationType(group.organizationType),
  });

  let categoriesOptions = null;

  if (categories) {
    categories = categories
      .map((category) => parseSelectCategory(category))
      .filter((category) => category.categoryId !== group.id);
    categoriesOptions = categories ? getCategoriesAsOptions(categories) : null;
  }

  useEffect(() => {
    if (isSuccess) {
      const newParentCategory = categories.find((category) => group.parentId === category.categoryId);
      setParentCategory(newParentCategory);
    }
  }, [isSuccess]);

  const onSubmit = preventDefault(() =>
    propOnSubmit(
      { ...formGroup, values: { ...formGroup.values, parentId: parentCategory.categoryId } },
      { enabled: isOpen }
    )
  );

  const OnNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleClose = () => {
    setName(group.name);

    close();
  };

  const onCategoryChange = (_, categoryOption) => {
    const newCategory = categories.find((category) => category.categoryId === categoryOption.value);

    setParentCategory(newCategory);
  };

  return (
    <CustomModal isOpen={isOpen} title={"Edit category"} onClose={handleClose} footerDisabled>
      <form onSubmit={onSubmit}>
        <Row className="my-2">
          <Col>
            <div className="mb-2">
              <DFormLabel label="Name" id="field-name" />
              <NmpInput
                id="field-name"
                type="text"
                value={name.value}
                placeholder="Enter category name"
                onChange={OnNameChange}
              />
            </div>

            <div>
              <DFormLabel label="Select parent category" id="dform-organization-category" />
              <NmpSelect
                id="dform-organization-category"
                value={parentCategoryValue}
                options={categoriesOptions}
                onChange={onCategoryChange}
              />
            </div>
          </Col>
        </Row>

        <Row className="my-3">
          <Col>
            <div className="d-flex justify-content-end">
              <NmpButton
                key="submit"
                type="primary"
                onClick={onSubmit}
                disabled={formGroup.invalid}
                loading={submitting}
              >
                Save
              </NmpButton>
            </div>
          </Col>
        </Row>
      </form>
    </CustomModal>
  );
};
