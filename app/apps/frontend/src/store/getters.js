const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  isLoaded: state => state.user.isLoaded,
  is_logged: state => state.user.is_logged,
  user: state => state.user.user,
  players: state => state.user.players,
  clans: state => state.user.clans,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  email: state => state.user.email,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
