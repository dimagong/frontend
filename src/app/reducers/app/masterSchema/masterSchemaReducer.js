const masterSchemaReducer = {
  getMasterSchemaFieldsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.isError = null;
    state.masterSchema.fields = payload;
  },

  getMasterSchemaOrganizationsSuccess: (state, { payload }) => {
    state.masterSchema.organizations = payload;

    state.isLoading = false;
    state.isError = null;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    const { field, toGroup, toOrganization } = payload;
    // ToDo: move it to its own layer
    const key = `${toGroup.key}/${field.id}`;
    const path = [...toGroup.path, field.name];

    field.key = key;
    field.path = path;

    try {
      // ToDo: refactor - make it DRY
      const organization = state?.masterSchema?.organizations?.find(
        ({ id, type }) => id === toOrganization.id && type === toOrganization.type
      );
      const masterSchemaRoot = organization?.masterSchema?.root;
      if (!masterSchemaRoot) throw new Error("Unable to get master schema root for field addition.");

      const parent =
        toGroup.key === masterSchemaRoot.key
          ? masterSchemaRoot
          : masterSchemaRoot.children.find((child) => child.key === toGroup.key);
      if (!parent) throw new Error("Unable to get parent for field addition.");

      parent.fields.push(field.key);
      masterSchemaRoot.children.push(field);

      state.isError = null;
    } catch (error) {
      state.isError = error;
    } finally {
      state.isLoading = false;
    }
  },

  addGroupToMasterSchemaSuccess(state, { payload }) {
    const { group, toParent, toOrganization } = payload;
    // ToDo: move it to its own layer
    const key = `${toParent.key}/${group.id}`;
    const path = [...toParent.path, group.name];

    group.key = key;
    group.path = path;

    try {
      // ToDo: refactor - make it DRY
      const organization = state?.masterSchema?.organizations?.find(
        ({ id, type }) => id === toOrganization.id && type === toOrganization.type
      );
      const masterSchemaRoot = organization?.masterSchema?.root;
      if (!masterSchemaRoot) throw new Error("Unable to get master schema root for field addition.");

      const parent =
        toParent.key === masterSchemaRoot.key
          ? masterSchemaRoot
          : masterSchemaRoot.children.find((child) => child.key === toParent.key);
      if (!parent) throw new Error("Unable to get parent for group addition.");

      parent.groups.push(group.key);
      masterSchemaRoot.children.push(group);

      state.isError = null;
    } catch (error) {
      state.isError = error;
    } finally {
      state.isLoading = false;
    }
  },

  setSelectedOrganizationMasterSchema: (state, { payload }) => {
    state.masterSchema.selectedOrganization = payload;
  },
};

export default masterSchemaReducer;
