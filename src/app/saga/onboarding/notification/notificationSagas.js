import { all, put, call, takeLatest, select } from "redux-saga/effects";

import notificationApi from "api/Onboarding/notification";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { selectNotifications } from "app/selectors/onboardingSelectors";

import onboardingSlice from "app/slices/onboardingSlice";
import appSlice from "app/slices/appSlice";

const { setNotifications, setNotification } = onboardingSlice.actions;

const {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsError,
  createNotificationSuccess,
  createNotificationRequest,
  createNotificationError,
  updateNotificationSuccess,
  updateNotificationRequest,
  updateNotificationError,
  deleteNotificationSuccess,
  deleteNotificationRequest,
  deleteNotificationError,
  setContext,
} = appSlice.actions;

function* getNotifications() {
  try {
    const surveyNotifications = yield call(notificationApi.getNotifications, { context: "survey" });
    const applicationNotifications = yield call(notificationApi.getNotifications, { context: "application" });

    yield put(getNotificationsSuccess());
    yield put(setNotifications([...surveyNotifications, ...applicationNotifications]));
  } catch (error) {
    yield put(getNotificationsError(error));
  }
}

function* createNotification({ payload }) {
  try {
    const responce = yield call(notificationApi.createNotification, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });

    yield put(createNotificationSuccess());
    const notifications = yield select(selectNotifications);
    yield put(setNotifications([...notifications, responce]));
    yield put(setContext(null));
    yield put(setNotification(null));
  } catch (error) {
    yield put(createNotificationError(error));
  }
}

function* updateNotification({ payload }) {
  try {
    const responce = yield call(notificationApi.updateNotification, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });
    yield put(updateNotificationSuccess());
    const notifications = yield select(selectNotifications);
    yield put(
      setNotifications(notifications.map((notification) => (notification.id === responce.id ? responce : notification)))
    );
  } catch (error) {
    console.log(error);
    yield put(updateNotificationError(error));
  }
}

function* deleteNotification({ payload }) {
  try {
    yield call(notificationApi.deleteNotification, payload);
    yield put(deleteNotificationSuccess());
    const notifications = yield select(selectNotifications);
    yield put(setNotifications(notifications.filter((notification) => notification.id !== payload.id)));
  } catch (error) {
    console.log(error);
    yield put(deleteNotificationError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getNotificationsRequest.type, getNotifications),
    yield takeLatest(createNotificationRequest.type, createNotification),
    yield takeLatest(updateNotificationRequest.type, updateNotification),
    yield takeLatest(deleteNotificationRequest.type, deleteNotification),
  ]);
}
