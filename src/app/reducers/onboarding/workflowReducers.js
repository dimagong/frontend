const setWorkflows = (state , {payload}) => {
  state.workflow.workflows = payload;
};

const setWorkflow = (state, {payload}) => {
  state.workflow.workflow = payload;
};

const setWorkflowGroups = (state, {payload}) => {
  state.workflow.workflow.groups = payload;
};

const setWorkflowTriggers = (state, {payload}) => {
  state.workflow.workflow.triggers = payload;
};


export default {
  setWorkflows,
  setWorkflow,
  setWorkflowGroups,
  setWorkflowTriggers,
};
