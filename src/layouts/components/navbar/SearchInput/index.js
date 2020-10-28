import React from 'react'

import AutoComplete from 'components/@vuexy/autoComplete/AutoCompleteComponent'
import classnames from 'classnames'
import { userManagmentOptionsPath } from 'constants/paths'
import noneAvatar from 'assets/img/portrait/none-avatar.png'

const SearchInputSuggestionsLayout = (
  suggestion,
  index,
  filteredData,
  activeSuggestion,
  onSuggestionItemClick,
  onSuggestionItemHover
) => {

  return (
    <li
      className={classnames("suggestion-item", {
        active: filteredData.indexOf(suggestion) === activeSuggestion
      })}
      key={index}
      onMouseEnter={() =>
        onSuggestionItemHover(filteredData.indexOf(suggestion))
      }
      onClick={e => {
        onSuggestionItemClick(userManagmentOptionsPath(suggestion.id), e)
      }}
    >
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-row">
          <div className="d-flex align-items-center">
            <img
              src={noneAvatar}
              alt={suggestion.name}
              height="32"
              width="32"
              className="mr-1 rounded-circle"
            />
          </div>
          <div className="d-flex flex-column justify-content-between">
            <span className="h4">{suggestion.name}</span>
            <span>ValidPath</span>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-between text-right">
          <span>User Profile</span>
          <span>{suggestion.status}</span>
        </div>
      </div>
    </li>
  )
}


const SearchInput = ({ suggestions }) => {

  return (
    <AutoComplete
      suggestions={suggestions}
      className="form-control"
      filterKey="name"
      suggestionLimit={4}
      defaultSuggestions={true}
      customRender={SearchInputSuggestionsLayout}
    />
  )
}

export default SearchInput
