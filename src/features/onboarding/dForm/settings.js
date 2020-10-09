export const initDForm = { 
    name: '',
      description: '',
      groups: [],
      schema: {
        schema: {
          properties: {},
          required: [],
          type: "object",
        },
        uiSchema: {
          groupStates: {},
          sectionStates: {},
          sections: {},
          onlySections: {
            "Main section": true,
            "Main section2": true,
          },
          sectionGroups: {
            "Group 1": "Main section",
            "Group 2": "Main section",
          },
          groups: {},
          columnsClasses: {},
          dependencies: {
            sections: {},
            groups: {},
            fields: {}
          }
        }
      },
      status: 'in-progress',
      reviewer_user_id: 1,
      manager_user_id: 1,
      assigned_user_id: 1,
      entity_id: 1,
      entity_type: 'App\\Workflow'
}