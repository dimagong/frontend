import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Scrollbars from "react-custom-scrollbars";
import React, { useMemo, useReducer, useState } from "react";
import { Col, Row, Spinner, Collapse } from "reactstrap";
import { Settings, ExpandLess, ExpandMore, Remove } from "@material-ui/icons";

import NmpSelect from "components/nmp/NmpSelect";
import NmpButton from "components/nmp/NmpButton";
import CustomModal from "components/CustomModal";

import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import { OptionsType, OptionType } from "utility/prop-types";

const RMFileReferenceOptionsQueryKey = createQueryKey("Resource Manager file reference options");

const RMFileReferenceOptionsQueryKeys = {
  all: () => [RMFileReferenceOptionsQueryKey],
  byReference: ({ referenceId }) => [...RMFileReferenceOptionsQueryKeys.all(), { referenceId }],
};

export const useRMFileReferenceOptionsQuery = ({ referenceId }, options) => {
  return useGenericQuery(
    {
      url: `api/resource-manager-field-file-reference/${referenceId}/options`,
      queryKey: RMFileReferenceOptionsQueryKeys.byReference({ referenceId }),
    },
    options
  );
};

export const useRMFileReferenceOptionsUpdate = ({ optionId, referenceId }, options) => {
  return useGenericMutation(
    {
      method: "put",
      url: `api/resource-manager-field-file-reference/options/${optionId}/option-update`,
      queryKey: RMFileReferenceOptionsQueryKeys.byReference({ referenceId }),
    },
    options
  );
};

const RMFileReferenceDFormOptionsQueryKey = createQueryKey("Resource Manager file reference DForm options");

const RMFileReferenceDFormOptionsQueryKeys = {
  all: () => [RMFileReferenceDFormOptionsQueryKey],
  byMasterSchemaFieldId: ({ masterSchemaFieldId }) => [
    ...RMFileReferenceDFormOptionsQueryKeys.all(),
    { masterSchemaFieldId },
  ],
};

export const useRMFileReferenceDFormOptionsQuery = ({ masterSchemaFieldId }, options) => {
  return useGenericQuery(
    {
      url: `api/resource-manager-field-file-reference/dform-options/${masterSchemaFieldId}`,
      queryKey: RMFileReferenceDFormOptionsQueryKeys.byMasterSchemaFieldId({ masterSchemaFieldId }),
    },
    options
  );
};

const modalReducer = (s, p) => {
  switch (p.type) {
    case "toggle":
      return s.isOpen ? { isOpen: false } : { isOpen: true };
    case "open":
      return { isOpen: true };
    case "close":
    default:
      return { isOpen: false };
  }
};

const initialAccordionState = {
  open: [],
};

const accordionReducer = (s, p) => {
  const has = () => s.open.includes(p.value);
  const add = () => [...new Set([...s.open, p.value])];
  const remove = () => s.open.filter((v) => v !== p.value);

  switch (p.type) {
    case "close":
      return { open: remove() };
    case "open":
      return { open: add() };
    case "toggle":
      return { open: (has() ? remove : add)() };
    default:
      return s;
  }
};

const Association = ({ name, onRemove }) => {
  return (
    <div className="ms-mapping__reference-association d-flex align-items-center">
      <NmpButton
        size="sm"
        color="custom"
        className="ms-mapping__reference-association-remove"
        icon={<Remove fontSize="inherit" />}
        title="Remove"
        onClick={onRemove}
      />
      <div className="" style={{ width: "calc(100% - 1.5rem)" }}>
        <div className="ms-mapping__reference-association-name" title={name}>
          {name}
        </div>
      </div>
    </div>
  );
};

const Option = ({ option, isOpen, onToggle, dFormOptions, referenceId }) => {
  const associations = option.options ?? [];
  const [dFormOption, setDFormOption] = useState(null);

  const optionsUpdate = useRMFileReferenceOptionsUpdate({ optionId: option.id, referenceId });

  const onAdd = () => {
    const new_options = [...option.options, dFormOption.value];
    optionsUpdate.mutate({ new_options });
  };

  const onRemove = (association) => {
    const index = associations.indexOf(association);
    const new_options = [...associations];
    new_options.splice(index, 1);
    optionsUpdate.mutate({ new_options });
  };

  return (
    <div className="ms-mapping__reference-option">
      <div className="ms-mapping__reference-option-header px-2 py-1" onClick={onToggle}>
        <Row className="align-items-center">
          <Col xs="10">
            <strong className="ms-mapping__reference-option-name">{option.option_name}</strong>
          </Col>
          <Col xs="2">{isOpen ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}</Col>
        </Row>
      </div>

      <Collapse isOpen={isOpen}>
        <div className="ms-mapping__reference-option-body px-1 pb-2">
          <Row className="align-items-center py-1">
            <Col xs="9">
              <NmpSelect
                value={dFormOption}
                options={dFormOptions.map((label) => ({ label, value: label }))}
                onChange={setDFormOption}
                backgroundColor="transparent"
                placeholder="Add new option mapping"
                menuPosition="fixed"
                searchable
              />
            </Col>
            <Col className="d-flex justify-content-end" xs="3">
              <NmpButton
                color="primary"
                size="sm"
                onClick={onAdd}
                disabled={associations.includes(dFormOption?.value)}
                loading={optionsUpdate.isLoading}
              >
                Add
              </NmpButton>
            </Col>
          </Row>

          <Scrollbars autoHeight autoHeightMax={80}>
            <div className="d-flex">
              {associations.map((association, id) => (
                <Association key={id} name={association} onRemove={() => onRemove(association)} />
              ))}
            </div>
          </Scrollbars>
        </div>
      </Collapse>
    </div>
  );
};

const Options = ({ referenceId, dFormOptions }) => {
  const [accordion, dispatchAccordion] = useReducer(accordionReducer, initialAccordionState);
  const { isLoading, data: templateOptions } = useRMFileReferenceOptionsQuery({ referenceId });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }

  if (!templateOptions || Array.isArray()) {
    return (
      <div>
        <strong>There is no options</strong>
      </div>
    );
  }

  return (
    <div>
      <strong className="ms-mapping__reference-name d-block mb-1">Reference field name</strong>

      <div className="py-1">
        <Scrollbars autoHeight autoHeightMax={400}>
          {templateOptions.map((templateOption) => (
            <Option
              option={templateOption}
              dFormOptions={dFormOptions}
              key={templateOption.id}
              isOpen={accordion.open.includes(templateOption.id)}
              onToggle={() => dispatchAccordion({ type: "toggle", value: templateOption.id })}
              referenceId={referenceId}
            />
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

const MappingFileReference = ({ name, value, options, onChange, reference }) => {
  const fieldValues = reference.field_values;
  const fieldTemplate = useMemo(() => `{{ ${reference.field_template} }}`, [reference.field_template]);

  const { isLoading, data: dFormOptions } = useRMFileReferenceDFormOptionsQuery(
    { masterSchemaFieldId: value?.value.id },
    // The master schema field as option value
    // can be a blank value which id is less than zero.
    { enabled: value.value.id > -1 }
  );

  const [modal, dispatchModal] = useReducer(modalReducer, { isOpen: false });

  const onSettingsButtonClick = () => {
    // Notify the user that he can not open reference settings modal
    // without setting master schema field of the template reference.
    if (value.value.id < 0) {
      toast.warn("Please select any master schema field by template reference.");
      return;
    }
    // If DForm options is loading do not open modal and
    // be sure that Settings button show the loading state in UI
    if (isLoading) return;

    dispatchModal({ type: "open" });
  };

  return (
    <Row className="py-1" noGutters>
      <Col xs="4">
        <div className="ms-mapping__template-key py-2 px-1 bg-white" title={fieldTemplate}>
          {fieldTemplate}
        </div>
      </Col>

      <Col className="d-flex align-items-center" xs="6">
        <div className="full-width pl-2">
          <NmpSelect
            name={name}
            value={value}
            options={options}
            onChange={onChange}
            backgroundColor="transparent"
            placeholder="Select a MasterSchema reference"
            menuPosition="fixed"
            searchable
          />
        </div>
      </Col>

      <Col className="d-flex align-items-center justify-content-center" xs="2">
        {fieldValues ? (
          <>
            <NmpButton
              size="sm"
              type="button"
              onClick={onSettingsButtonClick}
              icon={<Settings fontSize="small" />}
              backgroundColor="#A9A9A9"
              loading={isLoading}
              style={{ borderRadius: "50%" }}
            />

            <CustomModal
              onClose={() => dispatchModal({ type: "close" })}
              isOpen={modal.isOpen}
              title="Option mapper"
              submitBtnText="Save"
              hiddenSubmitButton
            >
              <Options referenceId={reference.id} dFormOptions={dFormOptions} />
            </CustomModal>
          </>
        ) : null}
      </Col>
    </Row>
  );
};

MappingFileReference.propTypes = {
  name: PropTypes.string.isRequired,
  value: OptionType,
  options: OptionsType.isRequired,
  onChange: PropTypes.func.isRequired,
  reference: PropTypes.object.isRequired,
};

export default MappingFileReference;
