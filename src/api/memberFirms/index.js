import { requestLayout } from "../index";

import {
  createMemberFirm,
  getMemberFirms,
} from "./constants";

const memberFirmsApi = {
  async createMemberFirm({ payload }) {
    return await requestLayout(createMemberFirm, "POST", payload)
  },

  async getMemberFirms() {
    return await requestLayout(getMemberFirms, "GET")
  },


};

export default memberFirmsApi;
