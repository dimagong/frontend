import axios from '../overrides/axios';

class WorkflowService {
  getDFormTriggers() {
    return axios.get("/api/dform/triggers");
  }

  getDFormActions() {
    return axios.get("/api/dform/actions");
  }

  getDFormAll() {
    return axios.get("/api/dform");
  }

  createDForm(dForm) {
    return axios.post("/api/dform", dForm);
  }

  dFormSubmit(dForm, submitData) {
    return axios.put("/api/dform/" + dForm.id + "/submit", submitData);
  }

  updateDForm(dForm) {
    return axios.put("/api/dform/" + dForm.id, dForm);
  }

  submitData(dForm, submitData) {
    return axios.put("/api/dform/" + dForm.id + '/submit-data', submitData);
  }

  deleteDForm(dForm) {
    return axios.delete("/api/dform/" + dForm.id);
  }

  onboardingDelete(onboarding) {
    return axios.delete("api/onboarding/" + onboarding.id)
  }

  onboardingCreate(onboarding) {
    return axios.post("api/onboarding", onboarding)
  }


  getDFormTemplateAll() {
    return axios.get("/api/dform-template");
  }

  createTemplateDForm(dForm) {
    return axios.post("/api/dform-template", dForm);
  }

  updateDFormTemplate(dForm) {
    return axios.put("/api/dform-template/" + dForm.id, dForm);
  }

  deleteDformTemplate(dForm) {
    return axios.delete("/api/dform-template/" + dForm.id);
  }

  changeStatus(dForm, status) {
    return axios.put("/api/dform/" + dForm.id + '/change-status', {
      status: status
    });
  }

  getWorkflows() {
    return axios.get("/api/workflow");
  }

  createWorkflow(workflow) {
    return axios.post("/api/workflow", workflow);
  }

  updateWorkflow(workflow) {
    return axios.put(`/api/workflow/${workflow.id}`, workflow);
  }

  deleteWorkflow(workflow) {
    return axios.delete("/api/workflow/" + workflow.id);
  }

  getNotifications() {
    return axios.get("/api/notification");
  }

  createNotification(notification) {
    return axios.post("/api/notification", notification);
  }

  updateNotification(notification) {
    return axios.put("/api/notification/" + notification.id, notification);
  }

  deleteNotification(notification) {
    return axios.delete("/api/notification/" + notification.id);
  }

  getModules() {
    return axios.get("/api/module");
  }
}

const workflowService = new WorkflowService();
Object.freeze(workflowService);

export default workflowService;
