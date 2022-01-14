import React from "react";

const PageTemplate = ({ children }) => {
  return (
    <>
      <div className="pageTemplate">
        <main className="main">{children}</main>
      </div>
      {/* {isLoading? <Spinner/>:null}
            {isError? <ErrorIndicator/>:null} */}
    </>
  );
};

export default PageTemplate;
