const showContextSearch = (state) => {
  state.isContextSearchVisible = true
}

const hideContextSearch = (state) => {
  state.isContextSearchVisible = false
}

const setContext = (state, {payload}) => {
  state.context = payload;
}

const setPreview = (state, {payload}) => {
  state.preview = payload;
}

export default {
  showContextSearch,
  hideContextSearch,
  setContext,
  setPreview,
}
