export class UserService {
  static isProfileMember(profile) {
    return ["prospect", "member"].indexOf(profile.permissions.ability) !== -1;
  }

  static isProfileManager(profile) {
    return ["prospect", "member"].indexOf(profile.permissions.ability) === -1;
  }
}
