export const ADD_FIELD = Symbol('MSEAdditionActions#AddField');
export const ADD_GROUP = Symbol('MSEAdditionActions#AddGroup');

export const addField = (id) => ({ id, type: ADD_FIELD });
export const addGroup = (id) => ({ id, type: ADD_GROUP });
