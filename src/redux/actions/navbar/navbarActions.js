export const setNavBarHeadText = (headTitle) => {
  return {
    type: "SET_NAV_BAR_HEAD_TEXT",
    payload: {
      headTitle: headTitle
    }
  }
}
