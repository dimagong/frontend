export const userService = {
  isOnboarding(userProfile) {

    // Fixing token issue when redux state isAuth = true and no token set
    // if(isEmpty(userProfile)) return true;

    return userProfile?.permissions?.ability === 'prospect'
  }
}
