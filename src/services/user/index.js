import { isEmpty } from 'lodash'

export const userService = {
  isOnboarding(userProfile) {

    if(isEmpty(userProfile)) return true;

    return ['prospect', 'adviser'].indexOf(userProfile?.permissions?.ability) !== -1;
  }
}
