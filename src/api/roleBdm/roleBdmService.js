import { requestLayout } from "api";

import * as Urls from "./constants";

export const RoleBdmService = {
  getBdmUsersByMemberFirm({ memberFirmId }) {
    return requestLayout(Urls.GetBdmUsersByMemberFirm(memberFirmId));
  },

  getPotentialsBdmUsersByMemberFirm({ memberFirmId }) {
    return requestLayout(Urls.GetPotentialBdmUsersByMemberFirm(memberFirmId));
  },
};
