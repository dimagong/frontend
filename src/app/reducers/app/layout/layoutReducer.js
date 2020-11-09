const showContextSearch = (state) => {
  state.isContextSearchVisible = true
}

const hideContextSearch = (state) => {
  state.isContextSearchVisible = false
}

export default {
  showContextSearch,
  hideContextSearch,
}
