import {isEmpty} from 'lodash'

export const userService = {
  isOnboarding(userProfile) {
    if(isEmpty(userProfile)) return true;

    return userProfile.roles.indexOf('prospect') !== -1
  }
}

