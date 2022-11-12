export class UserService {
  static isMember(profile) {
    return ["prospect", "member"].indexOf(profile.permissions.ability) !== -1;
  }

  static isManager(profile) {
    return ["prospect", "member"].indexOf(profile.permissions.ability) === -1;
  }
}
