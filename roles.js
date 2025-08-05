function hasVerifiedRole(member) {
  return member.roles.cache.some(r => r.name === 'verified');
}
function hasAdminRole(member) {
  return member.permissions.has('Administrator') || member.roles.cache.some(r => r.name === 'admin');
}
module.exports = { hasVerifiedRole, hasAdminRole };