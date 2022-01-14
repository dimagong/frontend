export const ADD_FIELD = Symbol('MSEAdditionActions#AddField');
export const ADD_GROUP = Symbol('MSEAdditionActions#AddGroup');

export const addFieldAction = (parent) => ({ parent, type: ADD_FIELD });
export const addGroupAction = (parent) => ({ parent, type: ADD_GROUP });
