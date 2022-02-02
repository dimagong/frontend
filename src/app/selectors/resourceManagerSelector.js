export const selectResourceManagersList = state => state.app.resourceManager.list;
export const selectSelectedResourceManager = state => state.app.resourceManager.selectedResourceManager;
export const selectResourceManagerHierarchy = state => state.app.resourceManager.hierarchy || [];
export const selectResourceManagerConnectionsAndVersions = state => state.app.resourceManager.connectionsAndVersions;
