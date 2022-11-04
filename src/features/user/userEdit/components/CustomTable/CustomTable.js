import "./styles.scss";

import _ from "lodash";
import Spinner from "reactstrap/lib/Spinner";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectCurrentManager, selectSelectedManagerAssignedSurveys } from "app/selectors/userSelectors";

import UpdateApplicationToLatestVersion from "features/user/userOnboarding/parts/UpdateApplicationToLatestVersion";

const { updateApllicationsOrderRequest, getAssignedSurveysRequest, getOnboardingsByUserRequest } = appSlice.actions;

export const CustomTable = ({ handleRowClick, selectedManager, selectedAssignedSurvey }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const isAssignedSurveysLoading = useSelector(createLoadingSelector([getAssignedSurveysRequest.type], true));
  const isOnbordingLoading = useSelector(createLoadingSelector([getOnboardingsByUserRequest.type], true));
  const assignedSurveys = useSelector(selectSelectedManagerAssignedSurveys);
  const manager = useSelector(selectCurrentManager);

  useEffect(() => {
    const sortOrder = _.sortBy([...manager.onboardings, ...(assignedSurveys || [])], function (application) {
      return application.order;
    });

    setData(sortOrder);
  }, [manager.onboardings, assignedSurveys]);

  // While refactor it to RQ is not possible. The Application tab of the user management, which requires
  // update on visibility change. RQ does it as window focus option.
  if (typeof document.hidden !== "undefined") {
    // Some browsers do not support it
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const onVisibilityChange = (event) => {
        if (!document.hidden) {
          dispatch(getOnboardingsByUserRequest(manager));
        }
      };

      document.addEventListener("visibilitychange", onVisibilityChange, false);
      return () => document.removeEventListener("visibilitychange", onVisibilityChange, false);
      // Only mounting lifecycle interests
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  const SortableCont = SortableContainer(({ children }) => {
    return <tbody>{children}</tbody>;
  });

  const arrayMove = (array, from, to) => {
    const newArray = [...array];
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  };

  const dataForStore = (array) => {
    const survey = array.filter((item) => item.type === "survey");
    const application = array.filter((item) => item.type === "application");

    const assignedSurvey = [...data]
      .filter((item) => item.context === "survey")
      .map((item) => {
        let value = survey.find((index) => index.id === item.id);

        return {
          ...item,
          order: value.order,
        };
      })
      .sort((a, b) => a.order - b.order);

    const onboardings = [...data]
      .filter((item) => item.context === "application")
      .map((item) => {
        let value = application.find((index) => index.id === item.id);

        return {
          ...item,
          order: value.order,
        };
      })
      .sort((a, b) => a.order - b.order);

    return {
      assignedSurvey,
      onboardings,
    };
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const sortedData = arrayMove(data, oldIndex, newIndex);
    setData(sortedData);

    if (oldIndex !== newIndex) {
      const orderedArray = orderedData(sortedData);
      const userId = manager.id;
      const storeData = dataForStore(orderedArray);

      dispatch(updateApllicationsOrderRequest({ userId, orderedArray, storeData }));
    }
  };

  const RowHandler = SortableHandle(() => <div className="custome_table__handle">|</div>);

  const isItemSelected = (value) => {
    if (selectedManager.onboarding) {
      if (value?.id === selectedManager.onboarding.id && !value.questions) {
        return "custome_table__row-active";
      }
    }

    if (selectedAssignedSurvey) {
      if (value?.id === selectedAssignedSurvey.id && !value?.d_form) {
        return "custome_table__row-active";
      }
    }

    return "";
  };

  const TableRow = ({ handleRowClick, value }) => {
    return (
      <tr onClick={() => handleRowClick(value)} className={`custome_table__row ${isItemSelected(value)}`}>
        <td style={{ minWidth: 150 }}>
          <div className="firstElement">
            <RowHandler />
            <div className="custome_table__wrap">
              {value.questions ? (
                <p className="custome_table__name">
                  {value.title} <b>Survey</b>
                </p>
              ) : (
                <p className="custome_table__name">
                  {value.d_form.name} <b>Application</b>
                </p>
              )}
            </div>
          </div>
        </td>
        <td>{value.reviewers.map((reviewer) => reviewer.first_name + " " + reviewer.last_name).join(", ")}</td>
        <td>{value.workflow.name}</td>
        <td>{value.is_internal ? "For reviewers only" : "No"}</td>
        <td>{upDate(value)}</td>
      </tr>
    );
  };

  const SortableItem = SortableElement((props) => <TableRow {...props} />);

  const upDate = (application) => {
    if (application.d_form) {
      return application.d_form?.up_to_date ? "Yes" : <UpdateApplicationToLatestVersion application={application} />;
    } else {
      return "-";
    }
  };

  const orderedData = (data) => {
    const array = [];

    data.forEach((item, index) => {
      const obj = {
        type: item.context || "survey",
        id: item.id,
        order: index,
      };

      array.push(obj);
    });

    return array;
  };

  if (isAssignedSurveysLoading || isOnbordingLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spinner className={"my-4"} color={"primary"} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ padding: 24, margin: 0, color: "rgba(0,0,0,0.87)" }}>There are no records to display</p>
      </div>
    );
  }

  return (
    <>
      <div className="custome_table">
        <table className="table table-dark fixed_header">
          <thead>
            <tr className="custome_table__row" style={{ minHeight: 56 }}>
              <th style={{ minWidth: 150 }}>
                <div style={{ marginLeft: 25 }}>Name</div>
              </th>
              <th>Reviewers</th>
              <th>Workflows</th>
              <th>Private</th>
              <th>Up to date</th>
            </tr>
          </thead>
          <SortableCont
            onSortEnd={handleSortEnd}
            axis="y"
            lockAxis="y"
            lockToContainerEdges={true}
            lockOffset={["30%", "50%"]}
            helperClass="helperContainerClass"
            useDragHandle={true}
          >
            {data.map((value, index) => (
              <SortableItem
                key={`item-${index}`}
                index={index}
                handleRowClick={(item) => handleRowClick(item)}
                value={value}
              />
            ))}
          </SortableCont>
        </table>
      </div>
    </>
  );
};
