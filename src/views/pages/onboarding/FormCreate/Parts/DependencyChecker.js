import Constants from "./Constants";
import {
  getEffectByType,
  getFieldsBySection,
  isFieldHasDefaultEffectByOperator,
  operatorResult,
  isValidationFieldPassed,
  getFieldsByGroup
} from "../helper";

export function dependencyChecker(state) {
  let fieldsStates = {};
  let groupsStates = {};
  let sectionsStates = {};

  const setField = (field, value, effect) => {
    if (!Array.isArray(fieldsStates[field])) {
      fieldsStates[field] = [];
    }
    fieldsStates[field].push({value: value, effect: effect})
  };

  const setGroup = (field, value, effect) => {
    if (!Array.isArray(groupsStates[field])) {
      groupsStates[field] = [];
    }
    groupsStates[field].push({value: value, effect: effect})
  };

  const setSection = (field, value, effect) => {
    if (!Array.isArray(sectionsStates[field])) {
      sectionsStates[field] = [];
    }
    sectionsStates[field].push({value: value, effect: effect})
  };

  Object.keys(state.uiSchema.dependencies.fields).forEach((field) => {
    if (!state.uiSchema.dependencies.fields[field] || !('conditions' in state.uiSchema.dependencies.fields[field])) return;

    const effect = getEffectByType(state.uiSchema.dependencies.fields[field].effect);

    state.uiSchema.dependencies.fields[field].conditions.forEach(condition => {

      // todo add function universal
      for (let fieldOperator of condition.fieldOperators) {
        // check required

        if (!(field in state.uiSchema)) {
          state.uiSchema[field] = {};
        }

        // todo 04.09.2020 bug  if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
        if (!(fieldOperator.field in state.formData)) {
          setField(field, isFieldHasDefaultEffectByOperator(fieldOperator.operator), effect);
          continue;
        }

        const fieldValue = state.formData[fieldOperator.field];

        if (operatorResult(this.state.schema.properties[fieldOperator.field], fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field)) {
          setField(field, true, effect);
          continue;
        }

        setField(field, false, effect);
      }

      for (let conditionField of condition.fields) {
        // check required
        if (!(field in state.uiSchema)) {
          state.uiSchema[field] = {};
        }
        if (!state.formData[conditionField] || !isValidationFieldPassed(state, conditionField)) {
          setField(field, true, effect);
        } else {
          setField(field, false, effect);
        }
      }

      for (let conditionGroup of condition.groups) {
        if (!(field in state.uiSchema)) {
          state.uiSchema[field] = {};
        }
        let isDisabled = getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });

        if (isDisabled) {
          setField(field, true, effect);
        } else {
          setField(field, false, effect);
        }
      }
    });
  });

  Object.keys(state.uiSchema.dependencies.groups).forEach((settingGroup) => {
    if (!('conditions' in state.uiSchema.dependencies.groups[settingGroup])) return;
    let isGroupDisabled = false;

    const effect = getEffectByType(state.uiSchema.dependencies.groups[settingGroup].effect);

    state.uiSchema.dependencies.groups[settingGroup].conditions.forEach(condition => {

      for (let fieldOperator of condition.fieldOperators) {
        // check required

        if (!(settingGroup in state.uiSchema.groupStates)) {
          state.uiSchema.groupStates[settingGroup] = {};
        }

        const fieldValue = state.formData[fieldOperator.field];
        const isDisabled = operatorResult(this.state.schema.properties[fieldOperator.field], fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field);

        const setStateForFieldsCurrGroup = () => {

          getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
            if (!(fieldInGroup in state.uiSchema)) {
              state.uiSchema[fieldInGroup] = {};
            }
            if (isDisabled) {
              setField(fieldInGroup, true, effect);
            } else {
              setField(fieldInGroup, false, effect);
            }
          });
        }

        if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
          state.uiSchema.groupStates[settingGroup][effect] = true;
          setStateForFieldsCurrGroup();
          continue;
        }

        if (isDisabled) {
          setGroup(settingGroup, true, effect);
        } else {
          setGroup(settingGroup, false, effect);
        }
        setStateForFieldsCurrGroup();
      }

      if (condition.fields.length) {
        // check required
        if (!(settingGroup in state.uiSchema.groupStates)) {
          state.uiSchema.groupStates[settingGroup] = {};
        }
        let isDisabled = condition.fields.some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });

        if (isDisabled) {
          setGroup(settingGroup, true, effect);
        } else {
          setGroup(settingGroup, false, effect);
        }

        getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
          if (!(fieldInGroup in state.uiSchema)) {
            state.uiSchema[fieldInGroup] = {};
          }
          if (isDisabled) {
            setField(fieldInGroup, true, effect);
          } else {
            setField(fieldInGroup, false, effect);
          }
        });
      }

      for (let conditionGroup of condition.groups) {

        // check required
        if (!(settingGroup in state.uiSchema.groupStates)) {
          state.uiSchema.groupStates[settingGroup] = {};
        }

        let isDisabled = getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });
        if (isDisabled) {
          setGroup(settingGroup, true, effect);
        } else {
          setGroup(settingGroup, false, effect);
        }
        getFieldsByGroup(state, settingGroup).forEach((fieldInGroup) => {
          if (!(fieldInGroup in state.uiSchema)) {
            state.uiSchema[fieldInGroup] = {};
          }
          if (isDisabled) {
            setField(fieldInGroup, true, effect);
          } else {
            setField(fieldInGroup, false, effect);
          }
        });
      }
    })
  });

  Object.keys(state.uiSchema.dependencies.sections).forEach((settingSection) => {
    if (!state.uiSchema.dependencies.sections[settingSection] || !('conditions' in state.uiSchema.dependencies.sections[settingSection])) return;

    const effect = getEffectByType(state.uiSchema.dependencies.sections[settingSection].effect);

    state.uiSchema.dependencies.sections[settingSection].conditions.forEach(condition => {
      for (let fieldOperator of condition.fieldOperators) {
        // check required

        if (!(settingSection in state.uiSchema.sectionStates)) {
          state.uiSchema.sectionStates[settingSection] = {};
        }

        const fieldValue = state.formData[fieldOperator.field];
        const isDisabled = operatorResult(this.state.schema.properties[fieldOperator.field], fieldOperator.operator, fieldValue, fieldOperator.value, fieldOperator.field);

        const setStateForFieldsCurrSection = () => {

          getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
            if (!(fieldInSection in state.uiSchema)) {
              state.uiSchema[fieldInSection] = {};
            }
            if (isDisabled) {
              setField(fieldInSection, true, effect);
            } else {
              setField(fieldInSection, false, effect);
            }
          });
        }

        if (!(fieldOperator.field in state.formData) || !state.formData[fieldOperator.field]) {
          setSection(settingSection, true, effect);
          setStateForFieldsCurrSection();
          continue;
        }

        if (isDisabled) {
          setSection(settingSection, true, effect);
        } else {
          setSection(settingSection, false, effect);
        }
        setStateForFieldsCurrSection();
      }

      if (condition.fields.length) {
        // check required
        if (!(settingSection in state.uiSchema.sectionStates)) {
          state.uiSchema.sectionStates[settingSection] = {};
        }
        let isDisabled = condition.fields.some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });

        if (isDisabled) {
          setSection(settingSection, true, effect);
        } else {
          setSection(settingSection, false, effect);
        }

        getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
          if (!(fieldInSection in state.uiSchema)) {
            state.uiSchema[fieldInSection] = {};
          }
          if (isDisabled) {
            setField(fieldInSection, true, effect);
          } else {
            setField(fieldInSection, false, effect);
          }
        });
      }

      for (let conditionGroup of condition.groups) {

        // check required
        if (!(settingSection in state.uiSchema.sectionStates)) {
          state.uiSchema.sectionStates[settingSection] = {};
        }

        let isDisabled = getFieldsByGroup(state, conditionGroup).some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });
        if (isDisabled) {
          setSection(settingSection, true, effect);
        } else {
          setSection(settingSection, false, effect);
        }
        getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
          if (!(fieldInSection in state.uiSchema)) {
            state.uiSchema[fieldInSection] = {};
          }
          if (isDisabled) {
            setField(fieldInSection, true, effect);
          } else {
            setField(fieldInSection, false, effect);
          }
        });
      }

      for (let conditionSection of condition.sections) {

        // check required
        if (!(settingSection in state.uiSchema.sectionStates)) {
          state.uiSchema.sectionStates[settingSection] = {};
        }

        let isDisabled = getFieldsBySection(state, conditionSection).some((fieldInGroup) => {
          return !(fieldInGroup in state.formData) ||
            (Array.isArray(state.formData[fieldInGroup]) && !state.formData[fieldInGroup].length) ||
            !state.formData[fieldInGroup] || !isValidationFieldPassed(state, fieldInGroup)
        });
        if (isDisabled) {
          setSection(settingSection, true, effect);
        } else {
          setSection(settingSection, false, effect);
        }
        getFieldsBySection(state, settingSection).forEach((fieldInSection) => {
          if (!(fieldInSection in state.uiSchema)) {
            state.uiSchema[fieldInSection] = {};
          }
          if (isDisabled) {
            setField(fieldInSection, true, effect);
          } else {
            setField(fieldInSection, false, effect);
          }
        });
      }
    })
  });

  Object.keys(fieldsStates).forEach(field => {
    if (!(field in state.uiSchema)) {
      state.uiSchema[field] = {};
    }

    let hidden = fieldsStates[field].find(fieldObj => {
      return fieldObj.value && fieldObj.effect === Constants.UI_HIDDEN;
    });
    let disabled = fieldsStates[field].find(fieldObj => {
      return fieldObj.value && fieldObj.effect === Constants.UI_DISABLED;
    });

    if (hidden) {
      state.uiSchema[field][hidden.effect] = true;
      return;
    }
    if (disabled) {
      state.uiSchema[field][disabled.effect] = true;
      return;
    }

    state.uiSchema[field] = {};
  });


  Object.keys(groupsStates).forEach(group => {
    if (!(group in state.uiSchema.groupStates)) {
      state.uiSchema.groupStates[group] = {};
    }

    let hidden = groupsStates[group].find(groupObj => {
      return groupObj.value && groupObj.effect === Constants.UI_HIDDEN;
    });
    let disabled = groupsStates[group].find(groupObj => {
      return groupObj.value && groupObj.effect === Constants.UI_DISABLED;
    });

    if (hidden) {
      state.uiSchema.groupStates[group][hidden.effect] = true;
      return;
    }
    if (disabled) {
      state.uiSchema.groupStates[group][disabled.effect] = true;
      return;
    }

    state.uiSchema.groupStates[group] = {};
  });


  Object.keys(sectionsStates).forEach(section => {
    if (!(section in state.uiSchema.sectionStates)) {
      state.uiSchema.sectionStates[section] = {};
    }

    let hidden = sectionsStates[section].find(sectionObj => {
      return sectionObj.value && sectionObj.effect === Constants.UI_HIDDEN;
    });
    let disabled = sectionsStates[section].find(sectionObj => {
      return sectionObj.value && sectionObj.effect === Constants.UI_DISABLED;
    });

    if (hidden) {
      state.uiSchema.sectionStates[section][hidden.effect] = true;
      return;
    }
    if (disabled) {
      state.uiSchema.sectionStates[section][disabled.effect] = true;
      return;
    }

    state.uiSchema.sectionStates[section] = {};
  })
}
