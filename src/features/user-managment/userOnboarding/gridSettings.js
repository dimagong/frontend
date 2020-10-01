export const columnDefs = [
  {
    name: 'DForm',
    cell: (onboarding) => {
      return onboarding.d_form.name
    }
  },
  {
    name: 'Reviewers',
    cell: (onboarding) => {
      return onboarding.reviewers.map(reviewer => reviewer.name).join(', ')
    }
  },
  {
    name: 'Workflow',
    cell: (onboarding) => {
      return onboarding.workflow.name;
    }
  },
  {
    name: 'Private',
    cell: (onboarding) => {
      if (onboarding.is_internal) {
        return 'For reviewers only'
      }
      return ''
    }
  },
]