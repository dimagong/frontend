export const ADD_FIELD = Symbol('Action#AddField');
export const ADD_GROUP = Symbol('Action#AddGroup');

export const addFieldAction = (parent) => ({ parent, type: ADD_FIELD });
export const addGroupAction = (parent) => ({ parent, type: ADD_GROUP });
