export const CREATE_FIELD = Symbol('MSEPopupActions#CreateField');
export const CREATE_GROUP = Symbol('MSEPopupActions#CreateGroup');

export const createField = (id) => ({ id, type: CREATE_FIELD });
export const createGroup = (id) => ({ id, type: CREATE_GROUP });
