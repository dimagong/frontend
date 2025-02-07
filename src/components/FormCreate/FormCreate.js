import "./FormCreate.scss";

import rfdc from "rfdc";
import Form from "@rjsf/material-ui";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { Check, X } from "react-feather";
import { useDispatch } from "react-redux";
import { debounce, isEmpty, isEqual } from "lodash";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormFeedback, Input, Row } from "reactstrap";

import appSlice from "app/slices/appSlice";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";

import Constants, {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DATE,
  FIELD_TYPE_FILE,
  FIELD_TYPE_FILE_LIST,
  FIELD_TYPE_LONG_TEXT_AREA,
  FIELD_TYPE_MULTI_SELECT,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_REFERENCE,
  FIELD_TYPE_RESOURCE,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_TEXT,
  FIELD_TYPE_TEXT_AREA,
  RJSF_FIELD_TYPE_HELP_TEXT,
  RJSF_FIELD_TYPE_RESOURCE,
} from "./Parts/Constants";
import DateInput from "./Custom/DateInput";
import Reference from "./Custom/Reference";
import TextWidget from "./Custom/TextWidget";
import { FileWidget } from "./Custom/FileWidget";
import SelectWidget from "./Custom/SelectWidget";
import fileService from "./services/file.service";
import DateTimeInput from "./Custom/DateTimeInput";
import LongTextWidget from "./Custom/LongTextWidget";
import TextAreaWidget from "./Custom/TextAreaWidget";
import DependencyEditModal from "./DependencyEditModal";
import { deepCompare, IsJsonString, makeid } from "./utils";
import Controls, { referenceObject } from "./Parts/Controls";
import { ObjectFieldTemplate } from "./Custom/ObjectFieldTemplate";

import FormOrdering from "./Ordering/index";
import { listControls } from "./Parts/ListControls";
import PropertyNameById from "./Parts/PropertyNameById";
import { dependencyChecker } from "./Parts/DependencyChecker";
import { getSpecificType, isElementProtected } from "./helper";

const { getMasterSchemaFieldsRequest } = appSlice.actions;

const clone = rfdc();

function InitFormCreate() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMasterSchemaFieldsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div />;
}

class FormCreate extends React.Component {
  state = {};

  constructor(props) {
    super(props);

    this.state = this.initState(props);

    this.refTitles = React.createRef();

    this.props.reInit && this.props.reInit(this.reInit, this);

    // customization
    this.objectFieldTemplate = ObjectFieldTemplate.bind(this);
    this.fileWidget = FileWidget.bind(this);

    // parts
    this.getListControls = listControls.bind(this);
    this.dependencyChecker = dependencyChecker.bind(this);

    this.multiSelectRef = React.createRef();
  }

  // hooks
  componentDidUpdate = (prevProps, prevState) => {
    if (!isEqual(prevProps, this.props)) {
      if (!isEqual(prevProps.dForm, this.props.dForm)) {
        // this.setState(this.initState(this.props));
        // this.groupedFiles();
        this.reInit();
      }
    }
  };

  async componentDidMount() {
    this.groupedFiles();
    this.refreshDependencies();
  }

  // initial state by props
  initState(props) {
    const propsDFormSchema = clone(props.dForm.schema.schema);
    const propsDFormUiSchema = clone(props.dForm.schema.uiSchema);
    const formData = !isEmpty(this.props.dForm.submit_data) ? clone(this.props.dForm.submit_data) : {};

    let fileLoading = false;
    const protectedPropertiesDefault = {
      fields: [],
      groups: [],
      sections: [],
    };

    propsDFormSchema.properties = isEmpty(propsDFormSchema.properties) ? {} : propsDFormSchema.properties;

    propsDFormUiSchema.groups = isEmpty(propsDFormUiSchema.groups) ? {} : propsDFormUiSchema.groups;
    propsDFormUiSchema.columnsClasses = isEmpty(propsDFormUiSchema.columnsClasses)
      ? {}
      : propsDFormUiSchema.columnsClasses;
    propsDFormUiSchema.sections = isEmpty(propsDFormUiSchema.sections) ? {} : propsDFormUiSchema.sections;
    propsDFormUiSchema.groupStates = isEmpty(propsDFormUiSchema.groupStates) ? {} : propsDFormUiSchema.groupStates;
    propsDFormUiSchema.onlySections = isEmpty(propsDFormUiSchema.onlySections) ? {} : propsDFormUiSchema.onlySections;
    propsDFormUiSchema.sectionGroups = isEmpty(propsDFormUiSchema.sectionGroups)
      ? {}
      : propsDFormUiSchema.sectionGroups;
    propsDFormUiSchema.sectionStates = isEmpty(propsDFormUiSchema.sectionStates)
      ? {}
      : propsDFormUiSchema.sectionStates;

    propsDFormUiSchema.dependencies.sections = isEmpty(propsDFormUiSchema.dependencies.sections)
      ? {}
      : propsDFormUiSchema.dependencies.sections;
    propsDFormUiSchema.dependencies.groups = isEmpty(propsDFormUiSchema.dependencies.groups)
      ? {}
      : propsDFormUiSchema.dependencies.groups;
    propsDFormUiSchema.dependencies.fields = isEmpty(propsDFormUiSchema.dependencies.fields)
      ? {}
      : propsDFormUiSchema.dependencies.fields;
    propsDFormUiSchema.fieldsOrdering =
      propsDFormUiSchema.fieldsOrdering && propsDFormUiSchema.fieldsOrdering.length
        ? propsDFormUiSchema.fieldsOrdering
        : Object.keys(propsDFormSchema.properties).map((next) => String(next));

    // error handling

    const errors = this.state?.uiSchema?.errors || { field: [] };
    let resultErrors = { field: [] };

    const getFieldSection = (field) => this.state.uiSchema.sections[field];
    const isFieldEmpty = (field) =>
      formData[field] === "" ||
      (Array.isArray(formData[field]) && formData[field].length === 0) ||
      formData[field] === null ||
      formData[field] === false;

    // eslint-disable-next-line array-callback-return
    errors.field.map((field) => {
      if (isFieldEmpty(field)) {
        const section = getFieldSection(field);

        // eslint-disable-next-line array-callback-return
        if (!section) return;

        if (!resultErrors[section]) {
          resultErrors[section] = [];
        }

        resultErrors[section].push(field);
        resultErrors.field.push(field);
      }
    });

    propsDFormUiSchema.errors = resultErrors;

    // error handling end

    if (props.fill && props.fill === true && props.dForm.submit_data && Object.keys(props.dForm.submit_data).length) {
      Object.keys(props.dForm.submit_data).forEach((key) => {
        if (key in propsDFormSchema.properties) {
          propsDFormSchema.properties[key].default = props.dForm.submit_data[key];
        }
      });
    }

    this.formatDefaultFormData(propsDFormSchema, formData);

    this.disableAllInputs(propsDFormSchema, propsDFormUiSchema);

    const protectedProperties = isEmpty(props.dForm.protected_properties)
      ? protectedPropertiesDefault
      : props.dForm.protected_properties;

    const loadingFiles = props.dForm.files ? this.getFormatLoadingFiles(props.dForm.files) : [];

    return {
      onboardingUser: props.onboardingUser,
      additionalData: {
        name: props.dForm.name,
        description: props.dForm.description,
        protected_properties: protectedProperties,
      },
      isShowProtectedElements:
        typeof props.isShowProtectedElements === "boolean" ? props.isShowProtectedElements : false,
      isShowToggleProtectedProperties:
        typeof props.isShowToggleProtectedProperties === "boolean" ? props.isShowToggleProtectedProperties : false,
      refresh: false,
      tabConfig: 0,
      inputDisabled: props.inputDisabled === true,
      fieldEdit: {
        propertyKey: "",
      },
      onSaveButtonHidden: props.onSaveButtonHidden === true,
      dFormActions: [
        { value: "submitted", label: "submitted" },
        { value: "approved", label: "approved" },
        { value: "rejected", label: "rejected" },
        { value: "unsubmitted", label: "unsubmitted" },
      ],
      fileLoading: fileLoading,
      dFormSelectedAction: this.getSelectedDFormAction(props.dForm.status),
      uiSettings: {
        section: "",
        group: "",
        classes: "",
        dependencies: {},
      },
      uiSchemaPropertyEdit: {
        UI_OPTIONS: {
          label: true,
        },
      },
      loadingFiles: loadingFiles,
      formData: formData,
      sumbitFormData: {},
      dFormTemplate: props.dForm,
      schemaPropertyEdit: {},
      schemaRequiredFields: [],
      schema: propsDFormSchema,
      controls: Controls,
      controlTypes: Constants.FIELD_TYPES,
      type: Constants.FIELD_TYPE_TEXT,
      section: "",
      uiSchema: propsDFormUiSchema,
      isShowErrors: props.isShowErrors,
    };
  }

  disableAllInputs(dFormSchema, dFormUiSchema) {
    if (this.props.inputDisabled) {
      Object.keys(dFormSchema.properties).forEach((key) => {
        if (!(key in dFormUiSchema)) {
          dFormUiSchema[key] = {};
        }
        dFormUiSchema[key][Constants.UI_DISABLED] = true;
      });
    }
  }

  formatDefaultFormData(schema, formData) {
    Object.keys(schema.properties).forEach((key) => {
      if (key in formData && formData[key]) {
        return;
      }

      switch (getSpecificType(schema.properties[key])) {
        case FIELD_TYPE_SELECT: {
          formData[key] = null;
          break;
        }
        case FIELD_TYPE_MULTI_SELECT: {
          formData[key] = [];
          break;
        }
        case FIELD_TYPE_BOOLEAN: {
          formData[key] = false;
          break;
        }
        case FIELD_TYPE_TEXT_AREA: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_LONG_TEXT_AREA: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_REFERENCE: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_TEXT: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_NUMBER: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_DATE: {
          formData[key] = "";
          break;
        }
        case FIELD_TYPE_FILE_LIST: {
          formData[key] = [];
          break;
        }
        case FIELD_TYPE_FILE: {
          formData[key] = "";
          break;
        }
        default: {
          formData[key] = "";
          break;
        }
      }
    });
  }

  requiredFieldsHandle = (formData) => {
    let requiredFields = this.state.schema.required;

    let getFieldSection = (field) => this.state.uiSchema.sections[field];

    let isFieldEmpty = (field) =>
      formData[field] === "" ||
      (Array.isArray(formData[field]) && formData[field].length === 0) ||
      formData[field] === null ||
      formData[field] === false;

    // Check is required fields are filled. Stop submitting and show error if true
    if (requiredFields?.length) {
      let errors = {
        field: [],
      };
      // eslint-disable-next-line array-callback-return
      requiredFields.map((field) => {
        if (isFieldEmpty(field)) {
          const section = getFieldSection(field);

          // eslint-disable-next-line array-callback-return
          if (!section) return;

          // eslint-disable-next-line no-mixed-operators
          if (
            (this.state.uiSchema[field] && Constants.UI_HIDDEN in this.state.uiSchema[field]) ||
            // eslint-disable-next-line no-mixed-operators,array-callback-return
            (this.state.uiSchema[field] && this.state.uiSchema[field][Constants.UI_HIDDEN])
          )
            return;

          if (!errors[section]) {
            errors[section] = [];
          }

          errors[section].push(field);
          errors.field.push(field);
        }
      });

      if (Object.keys(errors).length > 1) {
        this.setState({
          ...this.state,

          uiSchema: {
            ...this.state.uiSchema,
            errors,
          },
        });

        return false;
      }
    }

    return true;
  };

  // submits, changes
  formSubmit = (event) => {
    let formData = event.formData;

    if (this.state.isShowErrors && !this.requiredFieldsHandle(formData)) {
      return;
    }

    Object.keys(formData).forEach((key) => {
      if (
        key in this.state.uiSchema &&
        ((Constants.UI_DISABLED in this.state.uiSchema[key] && this.state.uiSchema[key][Constants.UI_DISABLED]) ||
          (Constants.UI_HIDDEN in this.state.uiSchema[key] && this.state.uiSchema[key][Constants.UI_HIDDEN]))
      ) {
        delete formData[key];
      }
      if (
        key in this.state.schema.properties &&
        this.state.schema.properties[key]?.type === Constants.FIELD_TYPE_HELP_TEXT
      ) {
        delete formData[key];
      }
      if (
        key in this.state.schema.properties &&
        this.state.schema.properties[key]?.type === Constants.FIELD_TYPE_RESOURCE
      ) {
        delete formData[key];
      }
    });

    document.querySelectorAll(".error-detail").forEach((nextElement) => {
      nextElement.parentNode.removeChild(nextElement);
    });

    this.setState({ sumbitFormData: formData });

    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
    return true;
  };

  onChangeForm = (event) => {
    let state = clone(this.state);
    let oldState = clone(this.state);
    state.formData = event.formData;
    this.dependencyChecker(state);
    this.setState(state);
    this.onChangeSaving(oldState.formData, state.formData);
  };

  submit = (event) => {
    this.setState((state) => {
      state.formData = event.formData;
      return {
        state,
      };
    });
  };

  submitDForm() {
    let schema = clone(this.state.schema);
    let uiSchema = clone(this.state.uiSchema);

    const propertyKeys = Object.keys(schema.properties);
    propertyKeys.forEach((objKey) => {
      if (objKey in uiSchema && isEmpty(uiSchema[objKey])) {
        delete uiSchema[objKey];
      }
    });

    let backendSchema = {
      schema: schema,
      uiSchema: uiSchema,
    };

    let dForm = clone(this.state.dFormTemplate);
    dForm.schema = backendSchema;
    dForm.groups = this.props.dForm.groups;
    this.props.submitDForm(dForm, this.state.additionalData);
  }

  onSave() {
    this.props.onSave && this.props.onSave(this.state.formData);
  }

  onCreateNewVersion() {
    this.props.onCreateNewVersion && this.props.onCreateNewVersion(this.state.formData);
  }

  removeRudimentFormData(formData) {
    Object.keys(formData).forEach((key) => {
      if (
        key in this.state.schema.properties &&
        this.state.schema.properties[key]?.type === Constants.FIELD_TYPE_HELP_TEXT
      ) {
        delete formData[key];
      }
      if (
        key in this.state.schema.properties &&
        this.state.schema.properties[key]?.type === Constants.FIELD_TYPE_RESOURCE
      ) {
        delete formData[key];
      }
    });
    return formData;
  }

  onChangeSaving = debounce((previousFormData, formData) => {
    if (!previousFormData || !formData) {
      return;
    }

    let previousFormDataFormatted = this.withoutFiles(previousFormData);
    let formDataFormatted = this.withoutFiles(formData);

    if (isEmpty(previousFormDataFormatted) || isEmpty(formDataFormatted)) return;

    if (this.props.onChange) {
      if (!deepCompare(previousFormDataFormatted, formDataFormatted)) {
        const newData = this.removeRudimentFormData(formDataFormatted);
        const oldData = this.props.dForm.submit_data;
        const diff = Object.keys(newData).filter((nextKey) => {
          return JSON.stringify(newData[nextKey]) !== JSON.stringify(oldData[nextKey]);
        });

        let newDiffData = {};

        for (let nextKey in diff) {
          newDiffData[diff[nextKey]] = newData[diff[nextKey]];
        }

        this.props.onChange(newDiffData);
      }
    }
  }, 0);

  // refresh btn for dForm
  reInit = debounce(() => {
    let state = this.initState(this.props);

    //state.formData = isEmpty(this.props.dForm.submit_data) ? {} : this.props.dForm.submit_data;
    this.dependencyChecker(state);
    this.setState(state, async () => {
      this.groupedFiles();
    });
  }, 100);

  // files
  withoutFiles(formData) {
    let formDataFormatted = clone(formData);
    Object.keys(this.state.schema.properties).forEach((key) => {
      const propType = getSpecificType(this.state.schema.properties[key]);
      if (propType === Constants.FIELD_TYPE_FILE || propType === Constants.FIELD_TYPE_FILE_LIST) {
        if (key in formDataFormatted) {
          delete formDataFormatted[key];
        }
      }
    });
    return formDataFormatted;
  }

  getFormatLoadingFiles(files) {
    return files.map((file) => {
      return {
        file,
        property_value: null,
      };
    });
  }

  setLoadingFiles() {
    this.setState({ loadingFiles: this.getFormatLoadingFiles(this.state.dFormTemplate.files) });
  }

  async groupedFiles() {
    if (!this.props.fileLoader) {
      return;
    }

    this.changeFilesState(true);
    this.setLoadingFiles();
    const response = await fileService.getDFormFiles(this.state.dFormTemplate.id);
    let groupedFiles = response.data.data;

    this.setState({ formData: { ...this.state.formData, ...groupedFiles } }, () => {
      this.changeFilesState(false);
      this.setState({ loadingFiles: [] }, () => {
        this.refreshDependencies();
      });
    });
  }

  changeFilesState(state) {
    let uiSchema = clone(this.state.uiSchema);
    Object.keys(this.state.schema.properties).forEach((key) => {
      const propType = getSpecificType(this.state.schema.properties[key]);
      if (propType === Constants.FIELD_TYPE_FILE || propType === Constants.FIELD_TYPE_FILE_LIST) {
        if (key in this.state.uiSchema) {
          uiSchema[key][Constants.UI_DISABLED] = state;
        } else {
          uiSchema[key] = {};
          uiSchema[key][Constants.UI_DISABLED] = state;
        }
      }
    });
    this.setState({ uiSchema });
  }

  // dependency
  refreshDependencies() {
    let state = clone(this.state);
    this.dependencyChecker(state);
    this.setState(state);
  }

  dependecyModalSave = (dependencyType, objKey) => {
    if (typeof this.state.fieldEdit.propertyKey === "string" && this.state.fieldEdit.propertyKey.trim() === "") {
      toast.error("Name should not be empty");
      return;
    }
    if (dependencyType === "sections" && this.isSectionNameAlreadyTaken(objKey, this.state.fieldEdit.propertyKey)) {
      return false;
    } else if (dependencyType === "groups" && this.isGroupNameAlreadyTaken(objKey, this.state.fieldEdit.propertyKey)) {
      return false;
    }

    let state = clone(this.state);

    if (state.uiSettings.protectedProperty) {
      let protectedPropertyIndex = state.additionalData.protected_properties[dependencyType].indexOf(objKey);
      if (protectedPropertyIndex === -1) {
        state.additionalData.protected_properties[dependencyType].push(objKey);
      }
    } else {
      let protectedPropertyIndex = state.additionalData.protected_properties[dependencyType].indexOf(objKey);
      if (protectedPropertyIndex !== -1) {
        state.additionalData.protected_properties[dependencyType].splice(protectedPropertyIndex, 1);
      }
    }

    this.changeNameByDependencyType(objKey, dependencyType, state);
    this.removeUiEffects(state, dependencyType, objKey);
    state.uiSchema.dependencies[dependencyType][objKey] = clone(state.uiSettings.dependencies);

    this.dependencyChecker(state);
    this.setState(state);
    return true;
  };

  dependencyModalOpen = (dependencyType, objKey) => {
    let dependencies =
      objKey in this.state.uiSchema.dependencies[dependencyType]
        ? this.state.uiSchema.dependencies[dependencyType][objKey]
        : {};
    this.setState({ fieldEdit: { ...this.state.fieldEdit, propertyKey: objKey } });

    this.setState({
      uiSettings: {
        classes: "",
        group: "",
        section: "",
        dependencies: dependencies,
        protectedProperty: isElementProtected(this.state, dependencyType, objKey),
      },
    });
  };

  renderDependencyPart = (dependencyType, objKey) => {
    let dependencyFields = null;

    if (Object.keys(this.state.uiSettings.dependencies).length) {
      dependencyFields = this.state.uiSettings.dependencies.conditions.map((condition, index) => {
        return (
          <Card className="mt-1" key={index}>
            <CardHeader>
              <CardTitle>Condition</CardTitle>
              <X size={15} className="cursor-pointer mr-1" onClick={(event) => this.removeConditional(event, index)} />
            </CardHeader>
            <CardBody>
              <hr />
              {dependencyType === "sections" ? (
                <div>
                  <label>Sections</label>
                  {condition.sections.map((condition, indexField) => {
                    return (
                      <div className="row ml-2 mt-1" key={index + "_" + indexField}>
                        <div className="col-md-10">
                          <select
                            className="form-control"
                            value={condition}
                            onChange={(event) => this.setConditionalField(event, "sections", index, indexField)}
                          >
                            <option key="-1" />
                            {this.getSections().map((type, indexType) => (
                              <option key={index + "_" + indexField + "_" + indexType}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="vertical-center dform-input">
                          <X
                            size={15}
                            className="cursor-pointer mr-1"
                            onClick={(event) => this.removeConditionalField(event, "sections", index, indexField)}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="row m-2">
                    <div
                      className="form-create__add-new-group small"
                      onClick={this.addConditionField.bind(this, "sections", index)}
                    >
                      Add section
                    </div>
                  </div>
                </div>
              ) : null}
              <div>
                <label>Groups</label>

                {condition.groups.map((condition, indexField) => {
                  return (
                    <div className="row mt-1 ml-2" key={indexField}>
                      <div className="col-md-10">
                        <select
                          className="form-control"
                          value={condition}
                          onChange={(event) => this.setConditionalField(event, "groups", index, indexField)}
                        >
                          <option key="-1" />
                          {this.getGroups().map((type, indexType) => (
                            <option key={indexType}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="vertical-center dform-input">
                        <X
                          size={15}
                          className="cursor-pointer mr-1"
                          onClick={(event) => this.removeConditionalField(event, "groups", index, indexField)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="row m-2">
                  <div
                    className="form-create__add-new-group small"
                    onClick={this.addConditionField.bind(this, "groups", index)}
                  >
                    Add group
                  </div>
                </div>
              </div>
              <div>
                <label>Fields</label>
                {condition.fields.map((condition, indexField) => {
                  return (
                    <div className="row mt-1 ml-2" key={indexField}>
                      <div className="col-md-10">
                        <select
                          className="form-control"
                          value={condition}
                          onChange={(event) => this.setConditionalField(event, "fields", index, indexField)}
                        >
                          <option key="-1" />
                          {Object.keys(this.state.schema.properties)
                            .filter((nextFilterField) => nextFilterField !== objKey)
                            .map((type, indexType) => (
                              <PropertyNameById key={indexType} fieldId={type} value={type} />
                            ))}
                        </select>
                      </div>

                      <div className="vertical-center dform-input">
                        <X
                          size={15}
                          className="cursor-pointer mr-1"
                          onClick={(event) => this.removeConditionalField(event, "fields", index, indexField)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="row m-2">
                  <div
                    className="form-create__add-new-group small"
                    onClick={this.addConditionField.bind(this, "fields", index)}
                  >
                    Add field
                  </div>
                </div>
              </div>
              <div>
                <label>Field operator</label>
                {condition.fieldOperators.length
                  ? condition.fieldOperators.map((fieldOperator, indexFieldOperator) => {
                      return (
                        <div className="row mt-1 ml-2" key={indexFieldOperator}>
                          <div className="col-md-3">
                            <select
                              className="form-control"
                              onChange={(event) =>
                                this.setOperatorField(event, "fieldOperators", index, indexFieldOperator, "field")
                              }
                              value={fieldOperator.field}
                            >
                              <option key="-1" />
                              {Object.keys(this.state.schema.properties)
                                .filter((nextFilterField) => nextFilterField !== objKey)
                                .map((type, indexType) => (
                                  <PropertyNameById key={indexType} value={type} fieldId={type} />
                                ))}
                            </select>
                          </div>

                          <div className="col-md-3">
                            <select
                              className="form-control"
                              onChange={(event) =>
                                this.setOperatorField(event, "fieldOperators", index, indexFieldOperator, "operator")
                              }
                              value={fieldOperator.operator}
                            >
                              <option key="-1" />
                              {Constants.DEPENDENCY_LOGIC_OPERATOR_ARR.map((type, indexType) => (
                                <option key={indexType}>{type}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              onChange={(event) =>
                                this.setOperatorField(event, "fieldOperators", index, indexFieldOperator, "value")
                              }
                              value={fieldOperator.value}
                              className="form-control"
                            />
                          </div>

                          <div className="vertical-center dform-input">
                            <X
                              size={15}
                              className="cursor-pointer mr-1"
                              onClick={(event) =>
                                this.removeConditionalField(event, "fieldOperators", index, indexFieldOperator)
                              }
                            />
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div className="row m-2">
                  <div
                    className="form-create__add-new-group small"
                    onClick={this.addOperatorField.bind(this, "fieldOperators", index)}
                  >
                    Add operator
                  </div>
                </div>
              </div>
              <div>
                <label>Default state (Effect)</label>
                <select
                  className="form-control"
                  value={this.state.uiSettings.dependencies.effect}
                  onChange={(event) => this.setConditionalEffect(event)}
                >
                  {this.getEffects().map((type, indexType) => (
                    <option key={indexType}>{type}</option>
                  ))}
                </select>
              </div>
            </CardBody>
          </Card>
        );
      });
    }

    return dependencyFields;
  };

  modalEditDependencies = (dependencyType, objKey) => {
    const dependencyFields = this.renderDependencyPart(dependencyType, objKey);

    let errorNameAlreadyTaken = false;

    if (dependencyType === "sections") {
      errorNameAlreadyTaken = this.isSectionNameAlreadyTaken(objKey, this.state.fieldEdit.propertyKey);
    } else if (dependencyType === "groups") {
      errorNameAlreadyTaken = this.isGroupNameAlreadyTaken(objKey, this.state.fieldEdit.propertyKey);
    }

    return (
      <DependencyEditModal
        onOpen={() => this.dependencyModalOpen(dependencyType, objKey)}
        onSave={() => this.dependecyModalSave(dependencyType, objKey)}
        onDelete={() => {
          this.deleteGroupOrSection(dependencyType, objKey);
        }}
      >
        <div className="row" key={objKey}>
          <div className="col-md-12 form-group">
            <Input
              id={`${objKey}`}
              value={this.state.fieldEdit.propertyKey}
              type="text"
              data-id={objKey}
              onChange={(event) =>
                this.setState({
                  fieldEdit: {
                    ...this.state.fieldEdit,
                    propertyKey: event.target.value,
                  },
                })
              }
              className="form-control"
              placeholder="Name"
              invalid={errorNameAlreadyTaken}
            />
            <FormFeedback>{errorNameAlreadyTaken ? "That name is already taken" : null}</FormFeedback>
          </div>
          <div className="col-md-12 form-group">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label="is protected"
              onChange={(event) => {
                this.setState({
                  uiSettings: { ...this.state.uiSettings, protectedProperty: event.target.checked },
                });
              }}
              checked={this.state.uiSettings.protectedProperty}
            />
          </div>
        </div>
        <div className="border-top">
          <div className="row">
            <h4 style={{ margin: "15px auto" }}>Conditions</h4>
          </div>
          {dependencyFields}
          <div className="row m-2">
            <div
              className="form-create__add-new-group"
              onClick={this.addConditional.bind(this, dependencyType, objKey)}
            >
              Add condition
            </div>
          </div>
        </div>
      </DependencyEditModal>
    );
  };

  // ui settings

  uiSettingsSave = (dependencyType, objKey) => {
    let state = clone(this.state);

    if (this.state.uiSettings.classes) {
      state.uiSchema.columnsClasses[objKey] = this.state.uiSettings.classes;
    } else {
      delete state.uiSchema.columnsClasses[objKey];
    }

    if (this.state.uiSettings.group) {
      state.uiSchema.groups[objKey] = this.state.uiSettings.group;
    } else {
      delete state.uiSchema.groups[objKey];
    }
    if (this.state.uiSettings.section) {
      state.uiSchema.sections[objKey] = this.state.uiSettings.section;
    } else {
      delete state.uiSchema.sections[objKey];
    }

    if (state.uiSettings.protectedProperty) {
      let protectedPropertyIndex = state.additionalData.protected_properties[dependencyType].indexOf(objKey);
      if (protectedPropertyIndex === -1) {
        state.additionalData.protected_properties[dependencyType].push(objKey);
      }
    } else {
      let protectedPropertyIndex = state.additionalData.protected_properties[dependencyType].indexOf(objKey);
      if (protectedPropertyIndex !== -1) {
        state.additionalData.protected_properties[dependencyType].splice(protectedPropertyIndex, 1);
      }
    }
    // todo duplicate with dependecyModalSave
    this.removeUiEffects(state, dependencyType, objKey);
    state.uiSchema.dependencies.fields[objKey] = clone(state.uiSettings.dependencies);
    this.dependencyChecker(state);

    this.setState(state);
    return true;
  };

  uiSettingsOpen = (objKey) => {
    let classes = objKey in this.state.uiSchema.columnsClasses ? this.state.uiSchema.columnsClasses[objKey] : "";
    let section = objKey in this.state.uiSchema.sections ? this.state.uiSchema.sections[objKey] : "";
    let group = objKey in this.state.uiSchema.groups ? this.state.uiSchema.groups[objKey] : "";
    let dependencies =
      objKey in this.state.uiSchema.dependencies.fields ? this.state.uiSchema.dependencies.fields[objKey] : {};
    this.setState({
      uiSettings: {
        classes: classes,
        group: group,
        section: section,
        dependencies: dependencies,
        protectedProperty: isElementProtected(this.state, "fields", objKey),
      },
    });
  };

  // ui effects

  getEffects = () => {
    return ["", Constants.EFFECT_DISABLED, Constants.EFFECT_HIDDEN];
  };

  // todo maybe this function not need, in future only using for dependencyChecker
  removeUiEffects = (state, dependencyType, objKey) => {
    state.uiSchema.sectionStates = {};

    state.uiSchema.groupStates = {};
    // todo bug https://app.asana.com/0/1187636553843237/1191964394328141
    // Object.keys(state.schema.properties).forEach(field => {
    //   delete state.uiSchema[field];
    // });
  };

  // dform select for status change
  getSelectedDFormAction(action) {
    return {
      value: action,
      label: action,
    };
  }

  setSelectedDFormAction(action) {
    this.setState({ dFormSelectedAction: action });
    this.props.statusChanged && this.props.statusChanged(action.value);
  }

  handleJsonChange(value) {
    if (IsJsonString(value)) {
      this.setState({
        schema: JSON.parse(value),
      });
    }
  }

  handleTitleChange(event) {
    this.setState({
      schema: Object.assign({}, this.state.schema, {
        title: event.target.value,
      }),
    });
  }

  inputHandlerRequired = (event, value) => {
    let schemaRequiredFields = clone(this.state.schemaRequiredFields);
    let index = schemaRequiredFields.indexOf(value);
    if (index === -1) {
      schemaRequiredFields.push(value);
    } else {
      schemaRequiredFields.splice(index, 1);
    }
    this.setState({
      schemaRequiredFields,
    });
    // this.setState((state) => {
    //
    // });
  };

  removePropertyField(previousFieldKey, stateOut = false) {
    let state = stateOut || clone(this.state);
    let schema = state.schema;
    const properties = schema.properties;
    schema.properties = {};

    if (Array.isArray(state.uiSchema.fieldsOrdering)) {
      state.uiSchema.fieldsOrdering = state.uiSchema.fieldsOrdering.filter((nextField) => {
        // only fo numbers
        return String(nextField) !== String(previousFieldKey);
      });

      const stringProps = Object.keys(properties).map((nextPropertyName) => String(nextPropertyName));

      state.uiSchema.fieldsOrdering = state.uiSchema.fieldsOrdering.filter((nextField) => {
        // only fo numbers
        return stringProps.indexOf(String(nextField)) !== -1;
      });
    }

    Object.keys(properties).forEach((deepIndex) => {
      if (previousFieldKey === deepIndex) {
        return;
      }
      schema.properties[deepIndex] = properties[deepIndex];
    });

    if (previousFieldKey in this.state.uiSchema.sections) {
      delete state.uiSchema.sections[previousFieldKey];
    }
    if (previousFieldKey in this.state.uiSchema.groups) {
      delete state.uiSchema.groups[previousFieldKey];
    }

    if (previousFieldKey in state.formData) {
      delete state.formData[previousFieldKey];
    }

    const protectedFieldIndex = state.additionalData.protected_properties["fields"].indexOf(previousFieldKey);
    if (protectedFieldIndex !== -1) {
      state.additionalData.protected_properties["fields"].splice(protectedFieldIndex, 1);
    }

    let requiredFieldIndex = schema.required.indexOf(previousFieldKey);
    if (requiredFieldIndex !== -1) {
      schema.required.splice(requiredFieldIndex, 1);
    }

    // dependencies for fields

    if (previousFieldKey in state.uiSchema.dependencies.fields) {
      delete state.uiSchema.dependencies.fields[previousFieldKey];
    }

    const dependencyTypes = ["fields", "groups", "sections"];

    dependencyTypes.forEach((dependencyType) => {
      let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

      dependencyFields.forEach((fieldKey) => {
        if (
          "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
          Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
        ) {
          state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
            dependencyType
          ][fieldKey].conditions.map((condition) => {
            condition.fieldOperators.forEach((fieldOperator, index) => {
              if (fieldOperator.field === previousFieldKey) {
                condition.fieldOperators.splice(index, 1);
              }
            });
            let previousIndexFieldKey = condition.fields.indexOf(previousFieldKey);
            if (previousIndexFieldKey > -1) {
              condition.fields.splice(previousIndexFieldKey, 1);
            }
            // groups
            // sections
            return condition;
          });
        }
      });
    });

    this.setState(state);
  }

  // rename object key
  inputKeyObjectHandler = (previousFieldKey) => {
    const newFieldKey = this.state.fieldEdit.propertyKey;
    if (newFieldKey === previousFieldKey) return;

    let state = clone(this.state);
    let schema = state.schema;
    const properties = schema.properties;
    schema.properties = {};

    if (previousFieldKey in state.uiSchema.columnsClasses) {
      state.uiSchema.columnsClasses[newFieldKey] = state.uiSchema.columnsClasses[previousFieldKey];
      delete state.uiSchema.columnsClasses[previousFieldKey];
    }

    Object.keys(properties).forEach((deepIndex) => {
      if (previousFieldKey === deepIndex) {
        schema.properties[newFieldKey] = properties[deepIndex];
        return;
      }
      schema.properties[deepIndex] = properties[deepIndex];
    });

    if (previousFieldKey in this.state.uiSchema.sections) {
      state.uiSchema.sections[newFieldKey] = this.state.uiSchema.sections[previousFieldKey];
      delete state.uiSchema.sections[previousFieldKey];
    }
    if (previousFieldKey in this.state.uiSchema.groups) {
      state.uiSchema.groups[newFieldKey] = this.state.uiSchema.groups[previousFieldKey];
      delete state.uiSchema.groups[previousFieldKey];
    }

    if (previousFieldKey in state.formData) {
      state.formData[newFieldKey] = state.formData[previousFieldKey];
      delete state.formData[previousFieldKey];
    }

    let requiredFieldIndex = schema.required.indexOf(previousFieldKey);
    if (requiredFieldIndex !== -1) {
      schema.required[requiredFieldIndex] = newFieldKey;
    }

    const protectedFieldIndex = state.additionalData.protected_properties["fields"].indexOf(previousFieldKey);
    if (protectedFieldIndex !== -1) {
      state.additionalData.protected_properties["fields"].splice(protectedFieldIndex, 1);
      state.additionalData.protected_properties["fields"].push(newFieldKey);
    }

    // dependencies for fields

    if (previousFieldKey in state.uiSchema.dependencies.fields) {
      state.uiSchema.dependencies.fields[newFieldKey] = state.uiSchema.dependencies.fields[previousFieldKey];
      delete state.uiSchema.dependencies.fields[previousFieldKey];
    }

    const dependencyTypes = ["fields", "groups", "sections"];

    dependencyTypes.forEach((dependencyType) => {
      let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

      dependencyFields.forEach((fieldKey) => {
        if (
          "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
          Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
        ) {
          state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
            dependencyType
          ][fieldKey].conditions.map((condition) => {
            condition.fieldOperators = condition.fieldOperators.map((fieldOperator) => {
              if (fieldOperator.field === previousFieldKey) {
                fieldOperator.field = newFieldKey;
              }
              return fieldOperator;
            });
            let previousIndexFieldKey = condition.fields.indexOf(previousFieldKey);
            if (previousIndexFieldKey > -1) {
              condition.fields.splice(previousIndexFieldKey, 1);
              condition.fields.push(newFieldKey);
            }
            // groups
            // sections
            return condition;
          });
        }
      });
    });

    if (previousFieldKey in state.uiSchema && !(previousFieldKey in state.schema.properties)) {
      delete state.uiSchema[previousFieldKey];
    }

    this.setState(state);
  };

  changePropertyEditing = (property, value) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit[property] = value;
    this.setState({ schemaPropertyEdit });
  };

  changeMasterSchemaFieldId = (value) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    if (isEmpty(schemaPropertyEdit.reference)) {
      schemaPropertyEdit.reference = { ...referenceObject };
    }
    schemaPropertyEdit.reference.field_id = value;
    this.setState({ schemaPropertyEdit });
  };

  elementTypeChange = (event, objKey) => {
    const {
      target: { value },
    } = event;

    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);

    delete schemaPropertyEdit["minimum"];
    delete schemaPropertyEdit["maximum"];
    delete schemaPropertyEdit["maxLength"];
    delete schemaPropertyEdit["minLength"];
    //schemaPropertyEdit.default = this.getDefaultValueByType(value);

    schemaPropertyEdit = this.state.controls[value];

    // if integer then is ms reference
    if (Number.isInteger(+this.state.fieldEdit.propertyKey)) {
      schemaPropertyEdit.reference.field_id = +this.state.fieldEdit.propertyKey;
    }

    // if(oldPropertyType && newPropertyType && oldPropertyType !== newPropertyType) {
    //     if(newFieldKey in uiSchema) {
    //       delete uiSchema[newFieldKey];
    //     }
    // }

    if (value === Constants.FIELD_TYPE_HELP_TEXT) {
      this.setState({ ...this.state, fieldEdit: { ...this.state.fieldEdit, propertyKey: "" } });
    }

    if (
      objKey in this.state.schema.properties &&
      "title" in this.state.schema.properties[objKey] &&
      "title" in this.state.schemaPropertyEdit
    ) {
      schemaPropertyEdit.title = this.state.schemaPropertyEdit.title;
    }
    this.setState({ schemaPropertyEdit, uiSchemaPropertyEdit: Constants.UI_SCHEMA_PROPERTY_EDIT });
  };

  inputChangeHandler = (event, objKey, prop) => {
    if (prop === "type") {
      return this.elementTypeChange(event, objKey, prop);
    }

    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);

    schemaPropertyEdit[prop] = value;

    this.setState({ schemaPropertyEdit });
  };

  wysiwygChange = (event, objKey, prop) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit[prop] = event;
    this.setState({ schemaPropertyEdit });
  };

  inputNumberChangeHandler = (event, index, prop) => {
    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    if (!value) {
      delete schemaPropertyEdit[prop];
    } else {
      schemaPropertyEdit[prop] = parseInt(value, 10);
    }

    this.setState({ schemaPropertyEdit });
  };

  addControl = (sectionName, groupName) => {
    this.setState(() => {
      let schema = clone(this.state.schema);
      let uiSchema = clone(this.state.uiSchema);
      let propertyName = "property_default " + (Object.keys(schema.properties).length + 1);
      if (propertyName in schema.properties) {
        propertyName += makeid(9);
      }
      schema.properties[propertyName] = this.state.controls[this.state.type];
      uiSchema.sections[propertyName] = sectionName;
      uiSchema.groups[propertyName] = groupName;
      uiSchema.fieldsOrdering.push(propertyName);

      return {
        schema,
        uiSchema,
      };
    });
  };

  setSelectValues = (event, objKey, index) => {
    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["enum"][index] = value;
    this.setState({ schemaPropertyEdit });
  };

  addSelectValues = () => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["enum"].push("");
    this.setState({ schemaPropertyEdit });
  };

  removeSelectValues = (event, objKey, index) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["enum"].splice(index, 1);
    this.setState({ schemaPropertyEdit });
  };

  setMultiSelectValues = (event, objKey, index) => {
    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["items"]["anyOf"][index]["enum"][0] = value;
    this.setState({ schemaPropertyEdit });
  };

  setMultiSelectTitle = (event, objKey, index) => {
    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["items"]["anyOf"][index].title = value;
    this.setState({ schemaPropertyEdit });
  };

  setMultiSelectTitleAndValue = (event, objKey, index) => {
    const {
      target: { value },
    } = event;
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["items"]["anyOf"][index].title = value;
    schemaPropertyEdit["items"]["anyOf"][index]["enum"][0] = value;
    this.setState({ schemaPropertyEdit });
  };

  addMultiSelectValues = () => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["items"]["anyOf"].push({
      type: "string",
      enum: [""],
      title: "",
    });
    this.setState({ schemaPropertyEdit });
  };

  removeMultiSelectValues = (event, objKey, index) => {
    let schemaPropertyEdit = clone(this.state.schemaPropertyEdit);
    schemaPropertyEdit["items"]["anyOf"].splice(index, 1);
    this.setState({ schemaPropertyEdit });
  };

  isValidPropertyName(previousFieldKey, newFieldKey) {
    const check =
      String(newFieldKey) !== String(previousFieldKey) &&
      Object.keys(this.state.schema.properties).some((next) => String(next) === String(newFieldKey));

    let isEmpty = false;
    let errorMessage = "Property field must not be duplicated or empty";
    let isError = false;

    const isNotRelatedToMasterSchema =
      Constants.NOT_MASTER_SCHEMA_FIELDS.indexOf(this.state.schemaPropertyEdit?.type) !== -1;

    if (isNotRelatedToMasterSchema) {
      if (Number.isInteger(+this.state.fieldEdit.propertyKey)) {
        errorMessage = "Property field must have at least one character";
        isError = true;
      }
      isEmpty = !this.state.fieldEdit.propertyKey;
    } else {
      isEmpty = !this.state.schemaPropertyEdit.reference?.field_id;
    }

    return {
      isError: check || isEmpty || isError,
      message: errorMessage,
    };
  }

  isSectionNameAlreadyTaken(previousFieldKey, newFieldKey) {
    return newFieldKey !== previousFieldKey && newFieldKey in this.state.uiSchema.onlySections;
  }

  isGroupNameAlreadyTaken(previousFieldKey, newFieldKey) {
    return newFieldKey !== previousFieldKey && newFieldKey in this.state.uiSchema.sectionGroups;
  }

  elementEditModalSave(previousFieldKey) {
    const newFieldKey = this.state.fieldEdit.propertyKey;

    const { message, isError } = this.isValidPropertyName(previousFieldKey, newFieldKey);

    if (isError) {
      toast.error(message);

      return;
    }

    const title = this.state.schemaPropertyEdit.title;
    if (
      typeof title === "string" &&
      title.trim() === "" &&
      [RJSF_FIELD_TYPE_HELP_TEXT, RJSF_FIELD_TYPE_RESOURCE].indexOf(this.state.schemaPropertyEdit.type) === -1
    ) {
      toast.error("Title should not be empty");

      return;
    }

    let schema = clone(this.state.schema);
    let uiSchema = clone(this.state.uiSchema);

    if (Array.isArray(uiSchema.fieldsOrdering)) {
      uiSchema.fieldsOrdering = uiSchema.fieldsOrdering.map((nextField) => {
        if (String(nextField) === String(previousFieldKey)) {
          return newFieldKey;
        }
        return nextField;
      });

      // const stringProps = Object.keys(schema.properties).map(nextPropertyName => String(nextPropertyName));
      //
      // uiSchema.fieldsOrdering = uiSchema.fieldsOrdering.filter(nextField => {
      //   if(stringProps.indexOf(String(nextField)) === -1) {
      //     return false;
      //   }
      //   return true;
      // });
    }

    schema.properties[previousFieldKey] = clone(this.state.schemaPropertyEdit);
    uiSchema[newFieldKey] = clone(this.state.uiSchemaPropertyEdit);

    schema.required = schema.required.filter((nextRequired) => {
      return !(
        this.state.fieldEdit.propertyKey === nextRequired || +this.state.fieldEdit.propertyKey === +nextRequired
      );
    });

    if (this.state.fieldEdit.isRequired) {
      schema.required.push(this.state.fieldEdit.propertyKey);
    }

    schema.required = schema.required.filter((nextRequired) => {
      return +nextRequired in schema.properties || nextRequired in schema.properties;
    });

    // todo set uiSchema type for reference or remove (legacy code not used)
    // if ('type' in schema.properties[previousFieldKey] && schema.properties[previousFieldKey]['type'] === Constants.RJSF_FIELD_TYPE_REFERENCE) {
    //   uiSchema[previousFieldKey]["ui:field"] = Constants.FIELD_TYPE_REFERENCE;
    // } else {
    //   delete uiSchema[previousFieldKey]['ui:field'];
    // }
    // -- end

    this.setState({ schema, uiSchema }, () => {
      this.inputKeyObjectHandler(previousFieldKey);
    });

    return true;
  }

  elementEditModalOpened = (column) => {
    let schemaPropertyEdit = clone(this.state.schema.properties[column]);
    let uiSchemaPropertyEdit = column in this.state.uiSchema ? clone(this.state.uiSchema[column]) : {};
    // let schemaRequiredFields = clone(this.state.schema.required);

    const fieldEdit = clone(this.state.fieldEdit);
    fieldEdit.propertyKey = column;
    fieldEdit.isRequired = this.state.schema.required.some(
      (nextRequired) => +nextRequired === +column || nextRequired === column
    );

    this.setState({ fieldEdit, schemaPropertyEdit, uiSchemaPropertyEdit });
  };

  changeUiSchemaTemplateMultiselect(event) {
    let uiSchemaPropertyEdit = clone(this.state.uiSchemaPropertyEdit);
    let suspendedValue = event.target.value;
    if (suspendedValue === "checkboxes") {
      uiSchemaPropertyEdit["ui:widget"] = suspendedValue;
    } else if ("ui:widget" in uiSchemaPropertyEdit) {
      delete uiSchemaPropertyEdit["ui:widget"];
    }

    this.setState({ uiSchemaPropertyEdit });
  }

  getUiSchemaTemplateMultiselect() {
    if (
      "ui:widget" in this.state.uiSchemaPropertyEdit &&
      this.state.uiSchemaPropertyEdit["ui:widget"] === "checkboxes"
    ) {
      return this.state.uiSchemaPropertyEdit["ui:widget"];
    }

    return "default";
  }

  getLabelShowingCheckbox() {
    if (!this.state.uiSchemaPropertyEdit[Constants.UI_OPTIONS]) return true;

    return !!(
      this.state.uiSchemaPropertyEdit[Constants.UI_OPTIONS] &&
      this.state.uiSchemaPropertyEdit[Constants.UI_OPTIONS]["label"]
    );
  }

  setLabelShowingCheckbox() {
    let uiSchemaPropertyEdit = clone(this.state.uiSchemaPropertyEdit);
    if (!(Constants.UI_OPTIONS in uiSchemaPropertyEdit)) {
      uiSchemaPropertyEdit[Constants.UI_OPTIONS] = {};
    }
    uiSchemaPropertyEdit[Constants.UI_OPTIONS]["label"] = !this.getLabelShowingCheckbox();
    uiSchemaPropertyEdit[Constants.UI_OPTIONS]["title"] = !this.getLabelShowingCheckbox();
    this.setState({ uiSchemaPropertyEdit });
  }

  addOperatorField = (conditionFieldType, index) => {
    let state = clone(this.state);

    state.uiSettings.dependencies.conditions[index][conditionFieldType].push({
      field: "text",
      operator: "=",
      value: "",
    });
    this.setState(state);
  };

  addConditionField = (conditionFieldType, index) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[index][conditionFieldType].push("");
    this.setState(state);
  };

  setConditionalField = (event, conditionFieldType, indexCondition, indexField) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType][indexField] = event.target.value;
    this.setState(state);
  };

  addNewSection() {
    let state = clone(this.state);
    let sectionName = "Tab " + (Object.keys(this.state.uiSchema.onlySections).length + 1);
    if (sectionName in state.uiSchema.onlySections) {
      sectionName += makeid(9);
    }
    state.uiSchema.onlySections[sectionName] = true;

    this.setState(state);
  }

  addNewGroup(section) {
    let state = clone(this.state);
    let groupName = "Group " + (Object.keys(this.state.uiSchema.sectionGroups).length + 1);
    if (groupName in state.uiSchema.sectionGroups) {
      groupName += makeid(9);
    }
    state.uiSchema.sectionGroups[groupName] = section;
    this.setState(state);
  }

  setOperatorField = (event, conditionFieldType, indexCondition, indexField, operatorKey) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType][indexField][operatorKey] =
      event.target.value;
    this.setState(state);
  };

  setConditionalEffect = (event) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.effect = event.target.value;

    this.setState(state);
  };

  removeConditionalField = (event, conditionFieldType, indexCondition, indexField) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions[indexCondition][conditionFieldType].splice(indexField, 1);
    this.setState(state);
  };

  removeConditional = (event, indexCondition) => {
    let state = clone(this.state);
    state.uiSettings.dependencies.conditions.splice(indexCondition, 1);
    this.setState(state);
  };

  addConditional = () => {
    let state = clone(this.state);

    if (Object.keys(state.uiSettings.dependencies).length) {
      state.uiSettings.dependencies.conditions.push({
        type: "validation",
        fields: [],
        groups: [],
        sections: [],
        fieldOperators: [],
      });
    } else {
      state.uiSettings.dependencies = {
        conditions: [
          {
            type: "validation",
            fields: [],
            groups: [],
            sections: [],
            fieldOperators: [],
          },
        ],
        effect: "disabled",
      };
    }

    this.setState(state);
  };

  changeClasses = (event) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.classes = event.target.value;
    } else {
      state.uiSettings.classes = "";
    }
    this.setState(state);
  };

  changeGroup = (event) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.group = event.target.value;
    } else {
      state.uiSettings.group = "";
    }
    this.setState(state);
  };

  changeSection = (event) => {
    let state = clone(this.state);
    if (event.target.value) {
      state.uiSettings.section = event.target.value;
    } else {
      state.uiSettings.section = "";
    }

    this.setState(state);
  };

  deleteGroupOrSection(type, previousFieldKey, stateOut = false) {
    if (type === "sections") {
      let state = stateOut || clone(this.state);

      Object.keys(state.uiSchema.sectionGroups).forEach((groupInSection) => {
        if (state.uiSchema.sectionGroups[groupInSection] === previousFieldKey) {
          this.deleteGroupOrSection("groups", groupInSection, state);
        }
      });

      let onlySectionTemp = {};
      Object.keys(state.uiSchema.onlySections).forEach((sectionName) => {
        if (previousFieldKey === sectionName) {
          if (state.tabConfig === Object.keys(this.state.uiSchema.onlySections).length - 1) {
            --state.tabConfig;
          }
          return;
        }
        onlySectionTemp[sectionName] = state.uiSchema.onlySections[previousFieldKey];
      });
      state.uiSchema.onlySections = onlySectionTemp;

      Object.keys(state.uiSchema.sections).forEach((fieldName) => {
        if (state.uiSchema.sections[fieldName] === previousFieldKey) {
          delete state.uiSchema.sections[fieldName];
        }
      });

      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (state.uiSchema.sectionGroups[groupName] === previousFieldKey) {
          delete state.uiSchema.sectionGroups[groupName];
        }
      });

      if (previousFieldKey in state.uiSchema.dependencies.sections) {
        delete state.uiSchema.dependencies.sections[previousFieldKey];
      }

      const protectedSectionIndex = state.additionalData.protected_properties["sections"].indexOf(previousFieldKey);
      if (protectedSectionIndex !== -1) {
        state.additionalData.protected_properties["sections"].splice(protectedSectionIndex, 1);
      }

      const dependencyTypes = ["fields", "groups", "sections"];

      dependencyTypes.forEach((dependencyType) => {
        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
              dependencyType
            ][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.sections.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.sections.splice(previousIndexFieldKey, 1);
              }
              // groups
              // sections
              return condition;
            });
          }
        });
      });

      this.setState(state);
    }
    if (type === "groups") {
      let state = stateOut || clone(this.state);

      Object.keys(state.uiSchema.groups).forEach((fieldKeyInGroup) => {
        if (state.uiSchema.groups[fieldKeyInGroup] === previousFieldKey) {
          this.removePropertyField(fieldKeyInGroup, state);
        }
      });

      Object.keys(state.uiSchema.groups).forEach((fieldName) => {
        if (state.uiSchema.groups[fieldName] === previousFieldKey) {
          delete state.uiSchema.groups[fieldName];
        }
      });

      let onlySectionGroups = {};
      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (previousFieldKey === groupName) {
          return;
        }
        onlySectionGroups[groupName] = state.uiSchema.sectionGroups[groupName];
      });
      state.uiSchema.sectionGroups = onlySectionGroups;

      if (previousFieldKey in state.uiSchema.dependencies.groups) {
        delete state.uiSchema.dependencies.groups[previousFieldKey];
      }

      const protectedFieldIndex = state.additionalData.protected_properties["groups"].indexOf(previousFieldKey);
      if (protectedFieldIndex !== -1) {
        state.additionalData.protected_properties["groups"].splice(protectedFieldIndex, 1);
      }

      const dependencyTypes = ["fields", "groups", "sections"];

      dependencyTypes.forEach((dependencyType) => {
        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
              dependencyType
            ][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.groups.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.groups.splice(previousIndexFieldKey, 1);
              }
              // groups
              // sections
              return condition;
            });
          }
        });
      });

      this.setState(state);
    }
  }

  changeNameByDependencyType(previousFieldKey, dependencyType, stateOut = false) {
    if (dependencyType === "sections") {
      const newFieldKey = this.state.fieldEdit.propertyKey.trim();

      if (newFieldKey === previousFieldKey) return;

      let state = stateOut || clone(this.state);

      let onlySectionTemp = {};
      Object.keys(state.uiSchema.onlySections).forEach((sectionName) => {
        if (previousFieldKey === sectionName) {
          onlySectionTemp[newFieldKey] = state.uiSchema.onlySections[previousFieldKey];
          return;
        }
        onlySectionTemp[sectionName] = state.uiSchema.onlySections[previousFieldKey];
      });
      state.uiSchema.onlySections = onlySectionTemp;

      Object.keys(state.uiSchema.sections).forEach((fieldName) => {
        if (state.uiSchema.sections[fieldName] === previousFieldKey) {
          state.uiSchema.sections[fieldName] = newFieldKey;
        }
      });

      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (state.uiSchema.sectionGroups[groupName] === previousFieldKey) {
          state.uiSchema.sectionGroups[groupName] = newFieldKey;
        }
      });

      if (previousFieldKey in state.uiSchema.dependencies.sections) {
        state.uiSchema.dependencies.sections[newFieldKey] = state.uiSchema.dependencies.sections[previousFieldKey];
        delete state.uiSchema.dependencies.sections[previousFieldKey];
      }

      const protectedFieldIndex = state.additionalData.protected_properties["sections"].indexOf(previousFieldKey);
      if (protectedFieldIndex !== -1) {
        state.additionalData.protected_properties["sections"].splice(protectedFieldIndex, 1);
        state.additionalData.protected_properties["sections"].push(newFieldKey);
      }

      const dependencyTypes = ["fields", "groups", "sections"];

      dependencyTypes.forEach((dependencyType) => {
        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
              dependencyType
            ][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.sections.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.sections.splice(previousIndexFieldKey, 1);
                condition.sections.push(newFieldKey);
              }
              return condition;
            });
          }
        });
      });

      this.setState(state);
    }
    if (dependencyType === "groups") {
      const newFieldKey = this.state.fieldEdit.propertyKey.trim();

      if (newFieldKey === previousFieldKey) return;

      let state = stateOut || clone(this.state);

      Object.keys(state.uiSchema.groups).forEach((fieldName) => {
        if (state.uiSchema.groups[fieldName] === previousFieldKey) {
          state.uiSchema.groups[fieldName] = newFieldKey;
        }
      });

      let onlySectionGroups = {};
      Object.keys(state.uiSchema.sectionGroups).forEach((groupName) => {
        if (previousFieldKey === groupName) {
          onlySectionGroups[newFieldKey] = state.uiSchema.sectionGroups[previousFieldKey];
          return;
        }
        onlySectionGroups[groupName] = state.uiSchema.sectionGroups[groupName];
      });
      state.uiSchema.sectionGroups = onlySectionGroups;

      if (previousFieldKey in state.uiSchema.dependencies.groups) {
        state.uiSchema.dependencies.groups[newFieldKey] = state.uiSchema.dependencies.groups[previousFieldKey];
        delete state.uiSchema.dependencies.groups[previousFieldKey];
      }

      const protectedFieldIndex = state.additionalData.protected_properties["groups"].indexOf(previousFieldKey);
      if (protectedFieldIndex !== -1) {
        state.additionalData.protected_properties["groups"].splice(protectedFieldIndex, 1);
        state.additionalData.protected_properties["groups"].push(newFieldKey);
      }

      const dependencyTypes = ["fields", "groups", "sections"];

      dependencyTypes.forEach((dependencyType) => {
        let dependencyFields = Object.keys(state.uiSchema.dependencies[dependencyType]);

        dependencyFields.forEach((fieldKey) => {
          if (
            "conditions" in state.uiSchema.dependencies[dependencyType][fieldKey] &&
            Array.isArray(state.uiSchema.dependencies[dependencyType][fieldKey].conditions)
          ) {
            state.uiSchema.dependencies[dependencyType][fieldKey].conditions = state.uiSchema.dependencies[
              dependencyType
            ][fieldKey].conditions.map((condition) => {
              let previousIndexFieldKey = condition.groups.indexOf(previousFieldKey);
              if (previousIndexFieldKey > -1) {
                condition.groups.splice(previousIndexFieldKey, 1);
                condition.groups.push(newFieldKey);
              }
              return condition;
            });
          }
        });
      });

      this.setState(state);
    }
  }

  getUniqueValues = (notUniqArray) => {
    return notUniqArray.filter((value, index, arr) => arr.indexOf(value) === index);
  };

  getSections = () => {
    const sections = Object.values(this.state.uiSchema.sections);
    return this.getUniqueValues(sections);
  };

  getGroups = () => {
    const groups = Object.values(this.state.uiSchema.groups);
    return this.getUniqueValues(groups);
  };

  getFieldsForFormOrdering = () => {
    return this.state.uiSchema.fieldsOrdering;
  };

  render() {
    let controls = this.getListControls(this.state.schema.properties);

    return (
      <Row>
        <InitFormCreate />
        {this.props.isStateConfig ? (
          <Col>
            <div className="form-group border-bottom">
              <label>Name</label>
              <input
                value={this.state.additionalData.name}
                onChange={(event) => {
                  this.setState({ additionalData: { ...this.state.additionalData, name: event.target.value } });
                }}
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group border-bottom">
              <label>Description</label>
              <input
                value={this.state.additionalData.description}
                onChange={(event) => {
                  this.setState({ additionalData: { ...this.state.additionalData, description: event.target.value } });
                }}
                type="text"
                className="form-control"
              />
            </div>
            <div className="d-flex justify-content-end">
              <FormOrdering
                sections={this.state.uiSchema.onlySections}
                groups={this.state.uiSchema.sectionGroups}
                fields={this.getFieldsForFormOrdering()}
                fieldsFilter={this.state.uiSchema.groups}
                onChangeSections={(items) => {
                  this.setState({ uiSchema: { ...this.state.uiSchema, onlySections: items } });
                }}
                onChangeGroups={(items) => {
                  this.setState({ uiSchema: { ...this.state.uiSchema, sectionGroups: items } });
                }}
                onChangeFields={(items) => {
                  this.setState({ uiSchema: { ...this.state.uiSchema, fieldsOrdering: items } });
                  //this.setState({schema: {...this.state.schema, properties: items}})
                }}
              />
            </div>
            <div className="">{controls}</div>
            <Row>
              <Col md="12">
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button color="primary d-flex-left" onClick={() => this.submitDForm()}>
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col>
            {/* Show only DForm create/edit cases */}
            {!this.props.onboardingUser ? (
              <>
                <div className="form-group border-bottom">
                  <label>Name</label>
                  <input
                    disabled
                    value={this.state.additionalData.name}
                    onChange={(event) => {
                      this.setState({ additionalData: { ...this.state.additionalData, name: event.target.value } });
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group border-bottom">
                  <label>Description</label>
                  <input
                    disabled
                    value={this.state.additionalData.description}
                    onChange={(event) => {
                      this.setState({
                        additionalData: { ...this.state.additionalData, description: event.target.value },
                      });
                    }}
                    type="text"
                    className="form-control"
                  />
                </div>
              </>
            ) : null}

            {this.state.isShowToggleProtectedProperties ? (
              <div className="mt-2 mb-2">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Subject view"
                  onChange={() => {
                    const formData = clone(this.state.formData);
                    this.setState(
                      {
                        isShowProtectedElements: !this.state.isShowProtectedElements,
                        formData: { ___refresh___field: true },
                      },
                      () => {
                        this.setState({
                          formData,
                        });
                        this.refreshDependencies();
                      }
                    );
                  }}
                  checked={this.state.isShowProtectedElements}
                />
              </div>
            ) : null}

            <Form
              showErrorList={false}
              liveValidate={false}
              noValidate={true}
              formData={this.state.formData}
              onSubmit={this.formSubmit}
              schema={this.state.schema}
              ObjectFieldTemplate={this.objectFieldTemplate}
              uiSchema={this.state.uiSchema}
              widgets={{
                FileWidget: this.fileWidget,
                TextWidget: TextWidget,
                LongTextWidget: LongTextWidget,
                SelectWidget: SelectWidget,
                TextareaWidget: TextAreaWidget,
                DateWidget: DateInput,
                DateTimeWidget: DateTimeInput,
              }}
              fields={{
                reference: Reference.bind(this),
                // NumberField: NumberWidget,
                //
              }}
              onChange={(event) => {
                this.onChangeForm(event);
              }}
            >
              <div className="form-create__dform_actions pr-1">
                {this.state.onSaveButtonHidden ? null : (
                  <Button
                    type="button"
                    color="primary"
                    onClick={() => {
                      this.onSave();
                    }}
                  >
                    Save
                  </Button>
                )}
                {/*{*/}
                {/*  this.props.updatedAtText ?*/}
                {/*    <div style={{'line-height': '38px'}}>*/}
                {/*      {this.props.updatedAtText}*/}
                {/*    </div>*/}
                {/*    : null*/}
                {/*}*/}

                {this.props.statusChanged ? (
                  <div style={{ width: "160px" }}>
                    <DeprecatedNmpSelect
                      className=""
                      classNamePrefix="select"
                      value={this.state.dFormSelectedAction}
                      options={this.state.dFormActions}
                      onChange={(value) => {
                        this.setSelectedDFormAction(value);
                      }}
                    />
                  </div>
                ) : null}
                {/*{*/}
                {/*  this.props.onSubmit ?*/}
                {/*    <Button type="submit" className="ml-auto" color="primary">Submit</Button> : null*/}
                {/*}*/}

                {this.props.updatedAtText && (
                  <div className="saving">
                    {this.props.updatedAtText}
                    {!!this.state?.uiSchema?.errors?.field.length && (
                      <div className={"submit-error-message"}>
                        Please fill in the missing fields highlighted in red!
                      </div>
                    )}
                  </div>
                )}
                {this.props.onSubmit && !this.props.onCreateNewVersion && (
                  <div style={{ float: "right", paddingRight: "20px" }}>
                    <span
                      style={{
                        color: "#7367f0",
                        paddingRight: "10px",
                        maxWidth: 400,
                        display: "inline-block",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {this.state.additionalData.name}
                    </span>
                    <Button type="submit" className="ml-auto submit-onboarding-button">
                      Submit for review
                    </Button>
                  </div>
                )}
                {this.props.onCreateNewVersion && (
                  <div style={{ float: "right", paddingRight: "20px" }}>
                    <Button type="submit" className="ml-auto submit-onboarding-button">
                      Save
                    </Button>
                  </div>
                )}
                {this.state.dFormTemplate.status === "submitted" && this.props.showSubmittedStatus && (
                  <div className="submitted-form-status">
                    <span>{this.state.additionalData.name}</span> submitted for review
                  </div>
                )}
              </div>
            </Form>
          </Col>
        )}
      </Row>
    );
  }
}

export default FormCreate;
