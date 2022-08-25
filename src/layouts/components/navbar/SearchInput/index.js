import React from "react";

import AutoComplete from "components/@vuexy/autoComplete/AutoCompleteComponent";
import classnames from "classnames";
import noneAvatar from "assets/img/portrait/none-avatar.png";
import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";
import DeprecatedNmpUserAvatar from "../../../../components/nmp/DeprecatedNmpUserAvatar";
import DeprecatedNmpMemberFirmLogo from "../../../../components/nmp/DeprecatedNmpMemberFirmLogo";

const {
  showContextSearch,
  setContext,
  setManager,
  setPreview,
  setSearch,
  getUserAvatarRequest,
  setSelectedMemberFirmId,
} = appSlice.actions;

const SearchInput = ({ suggestions }) => {
  const dispatch = useDispatch();

  const SearchInputSuggestionsLayout = (
    suggestion,
    index,
    filteredData,
    activeSuggestion,
    onSuggestionItemClick,
    onSuggestionItemHover
  ) => {
    let suggestionIsUser = suggestion.hasOwnProperty("status");

    if (suggestionIsUser) {
      if (!!suggestion.avatar_path && !suggestion.url) dispatch(getUserAvatarRequest({ managerId: suggestion.id }));
    }

    return (
      <li
        className={classnames("suggestion-item", {
          active: filteredData.indexOf(suggestion) === activeSuggestion,
        })}
        key={index}
        onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(suggestion))}
        onClick={(e) => {
          onSuggestionItemClick(null, e);
          if (suggestionIsUser) {
            if (e.ctrlKey) {
              dispatch(showContextSearch());
              dispatch(setPreview({ type: "user", first_name: suggestion.name, ...suggestion }));
            } else {
              dispatch(setManager({ first_name: suggestion.name, ...suggestion }));
              dispatch(setContext("User"));
            }
          } else {
            dispatch(showContextSearch());
            dispatch(setSelectedMemberFirmId(suggestion.id));
            dispatch(setContext(`Member Firms`));
          }
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <div className="d-flex align-items-center">
              {suggestion.isMemberFirm ? (
                <DeprecatedNmpMemberFirmLogo
                  fileId={suggestion.logo?.id}
                  memberFirmId={suggestion.id}
                  height="32"
                  width="32"
                  className="mr-1 rounded-circle"
                />
              ) : (
                <DeprecatedNmpUserAvatar
                  fileId={suggestion.avatar?.id}
                  userId={suggestion.id}
                  height="32"
                  width="32"
                  className="mr-1 rounded-circle"
                />
              )}
              {/*<img
                src={suggestionIsUser ? suggestion.url || noneAvatar : suggestion.logo || noneAvatar}
                alt={suggestion.name}
              />*/}
            </div>
            <div className="d-flex flex-column justify-content-between">
              <span className="h4">{suggestion.name}</span>
              <span>
                {suggestionIsUser ? suggestion?.permissions?.organization || "" : suggestion?.network?.name || ""}
              </span>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between text-right">
            <span>{suggestionIsUser ? "User Profile" : "Member Firm"}</span>
            <span>{suggestion.status || ""}</span>
          </div>
        </div>
      </li>
    );
  };

  const handleEnter = (inputText) => {
    //dispatch(setManager({first_name: suggestion.name, ...suggestion}))
    //dispatch(setContext("User"))
    dispatch(setSearch(inputText));
    dispatch(showContextSearch());
  };

  return (
    <AutoComplete
      placeholder="Search"
      suggestions={suggestions}
      className="form-control"
      filterKey="name"
      onEnter={handleEnter}
      suggestionLimit={4}
      defaultSuggestions={false}
      customRender={SearchInputSuggestionsLayout}
      showClear={true}
    />
  );
};

export default SearchInput;
