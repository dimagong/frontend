import React, { useState } from "react";

import ContextSearch from './ContextSearch'
import Context from './Context'
import UserManagment from 'features/user-managment/UserManagment'

const Home = () => {

  const [isContextSearchVisible, setIsContextSearchVisible] = useState(true)

  const handleContextSearchHide = () => {
    console.log("SOMETHING")
    setIsContextSearchVisible(false)
  }

  const handleContextSearchShow = () => {
    setIsContextSearchVisible(true)
  }



  return (
    <>
      <ContextSearch
        isShown={isContextSearchVisible}
        onContextSearchHide={handleContextSearchHide}
      />
      <Context />
    </>
  );
};

export default Home;
