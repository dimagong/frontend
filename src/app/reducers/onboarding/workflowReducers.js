  const setWorkflows = (state , {payload}) => ({
    ...state,
    workflow: {
      workflows: payload,
      workflow: state.workflow.workflow
    }
  });

  const setWorkflow = (state, {payload}) => ({
    ...state,
    workflow: {
      workflows: state.workflow.workflows,
      workflow: payload
    }
  });

  const setWorkflowGroups = (state, {payload}) => ({
    ...state,
    workflow: {
      workflows: state.workflow.workflows,
      workflow: {
        ...state.workflow.workflow,
        groups: payload
      }
    }
  })

  const setWorkflowTriggers = (state, {payload}) => ({
    ...state,
    workflow: {
      workflows: state.workflow.workflows,
      workflow: {
        ...state.workflow.workflow,
        triggers: payload
      }
    }
  })


export default {
  setWorkflows,
  setWorkflow,
  setWorkflowGroups,
  setWorkflowTriggers,
  };