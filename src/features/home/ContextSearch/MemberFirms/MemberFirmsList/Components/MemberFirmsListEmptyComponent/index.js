import React from "react";
import { Spinner } from "reactstrap";

import "./styles.scss";

const MemberFirmsListEmptyComponent = ({ isLoading }) => {
  return (
    <div className="member_firms_list-empty">
      {isLoading ? (
        <Spinner size={40} color="primary" className="member_firms_list-empty-loading" />
      ) : (
        <div className="member_firms_list-empty-firms_absent">
          There is no created member firms, click a plus button to create member firm
        </div>
      )}
    </div>
  );
};

export default MemberFirmsListEmptyComponent;
