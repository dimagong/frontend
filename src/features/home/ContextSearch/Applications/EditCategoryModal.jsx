import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

import { preventDefault } from "utility/event-decorators";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget/DFormSelectWidget";
import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import CustomModal from "components/CustomModal";

import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";
import { parseOrganizationType } from "features/home/ContextSearch/Applications/utils/organizationTypeConverter";
import { useCategoriesByOrganization } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";
import { NpmButton } from "features/nmp-ui";

export const EditCategoryModal = ({ isOpen, close, group, onSubmit: propOnSubmit, submitting }) => {
  const [name, setName] = useFormField(group.name, [Validators.required]);
  const [parentCategory, setParentCategory] = useState(null);
  const formGroup = useFormGroup({ name });

  let { data: categories, isSuccess } = useCategoriesByOrganization({
    organizationId: group.organizationId,
    organizationType: parseOrganizationType(group.organizationType),
  });

  if (categories) {
    categories = categories.map((category) => parseSelectCategory(category));
  }

  useEffect(() => {
    if (isSuccess) {
      const newParentCategory = categories.find((category) => group.parentId === category.id);
      setParentCategory(newParentCategory);
    }
  }, [isSuccess]);

  const onSubmit = preventDefault(() =>
    propOnSubmit({ ...formGroup, values: { ...formGroup.values, parentId: parentCategory.id } }, { enabled: isOpen })
  );

  const OnNameChange = (newName) => {
    setName(newName);
  };

  const handleClose = () => {
    setName(group.name);

    close();
  };

  const onCategoryChange = (categoryOption) => {
    const newCategory = categories.find((category) => category.id === categoryOption.value);

    setParentCategory(newCategory);
  };

  return (
    <CustomModal isOpen={isOpen} title={"Edit category"} onClose={handleClose} footerDisabled>
      <form onSubmit={onSubmit}>
        <Row className="my-2">
          <Col>
            <DFormTextWidget
              id="field-name"
              label={"Name"}
              value={name.value}
              placeholder="Enter category name"
              isError={false}
              isRequired={true}
              isDisabled={false}
              isLabelShowing={true}
              onChange={OnNameChange}
              className="mb-2"
            />
            <DFormSelectWidget
              id="dform-organization-category"
              label="Select parent category"
              value={parentCategory ? getCategoryAsOption(parentCategory) : null}
              options={categories ? getCategoriesAsOptions(categories) : null}
              isError={false}
              isRequired={false}
              isDisabled={false}
              isLabelShowing={true}
              onChange={onCategoryChange}
            />
          </Col>
        </Row>

        <Row className="my-3">
          <Col>
            <div className="d-flex justify-content-end">
              <NpmButton
                key="submit"
                type="primary"
                onClick={onSubmit}
                disabled={formGroup.invalid}
                loading={submitting}
              >
                Save
              </NpmButton>
            </div>
          </Col>
        </Row>
      </form>
    </CustomModal>
  );
};
