export const ADD_FIELD = Symbol('MSEAdditionActions#AddField');
export const ADD_GROUP = Symbol('MSEAdditionActions#AddGroup');

export const addField = (key) => ({ key, type: ADD_FIELD });
export const addGroup = (key) => ({ key, type: ADD_GROUP });
