const setWorkflows = (state , {payload}) => {

  state.workflow.workflows = payload;

  // old code, what is that for ?
  // state.workflow.workflow = state.workflow.workflow;
};

const setWorkflow = (state, {payload}) => {
  // Same again
  // state.workflow.workflows = state.workflow.workflows;
  state.workflow.workflow = payload;
};

const setWorkflowGroups = (state, {payload}) => {
  // And again
  // state.workflow.workflows = state.workflow.workflows;
  state.workflow.workflow.groups = payload;
}

const setWorkflowTriggers = (state, {payload}) => {
  // And again
  // state.workflow.workflows = state.workflow.workflows;
  state.workflow.workflow.triggers = payload;
}


export default {
  setWorkflows,
  setWorkflow,
  setWorkflowGroups,
  setWorkflowTriggers,
  };
