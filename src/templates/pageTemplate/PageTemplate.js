import React from "react";
import { useSelector } from "react-redux";
import { selectLoading, selectError } from "app/selectors/authSelectors";
// import Spinner from "components/Spinner";
// import ErrorIndicator from "components/Error";

const PageTemplate = ({ children }) => {
  const isLoading = useSelector(selectLoading);
  const isError = useSelector(selectError);
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
