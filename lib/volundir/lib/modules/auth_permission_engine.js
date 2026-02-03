export class AuthPermissionEngine {
  constructor(profiles) {
    this.profiles = profiles;
  }

  can(user, action) {
    if (!user || !user.profile) return false;

    const permissions = this.profiles[user.profile] || [];
    return permissions.includes(action);
  }
}
