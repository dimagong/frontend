import React from 'react';
import { Spinner } from 'reactstrap';


import './styles.scss'

const MemberFirmsListEmptyComponent = ({ isLoading }) => {


  return (
    <div className="member_firms_list-empty">
      {true ? (
        <Spinner color="primary" />
      ) : (
        <div>
          There is no created member firms,
          click a plus button to create member firm
        </div>
      )}

    </div>
  )
};

export default MemberFirmsListEmptyComponent;
