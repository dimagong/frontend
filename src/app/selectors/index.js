import { selectAuth, selectLoading, selectError } from "./authSelectors";
import { selectGroups } from "./groupSelector";
import {
  selectNotifications,
  selectNotification,
  selectdForms,
  selectdForm,
  selectdFormTriggers,
  selectdFormActions,
} from "./onboardingSelectors";
import {selectRoles} from './roleSelector'
import {selectManagers, selectManager} from './userSelectors'
import {selectModules} from './moduleSelector'

export {
  selectAuth,
  selectLoading,
  selectError,
  selectNotifications,
  selectNotification,
  selectdForms,
  selectdForm,
  selectdFormTriggers,
  selectdFormActions,
  selectGroups,
  selectRoles,
  selectManagers,
  selectManager,
  selectModules
};
