import React from 'react'

import AutoComplete from 'components/@vuexy/autoComplete/AutoCompleteComponent'
import classnames from 'classnames'
import { userManagmentOptionsPath } from 'constants/paths'
import noneAvatar from 'assets/img/portrait/none-avatar.png'
import {getGroupName} from 'utility/select/prepareSelectData'
import {groupTypes} from '../../../../constants/group'
import {useSelector} from 'react-redux'
import {selectGroups} from 'app/selectors'
import {useDispatch} from 'react-redux'
import {showContextSearch, setContext, setManager, setPreview} from 'app/slices/appSlice'

const SearchInput = ({ suggestions }) => {

  const dispatch = useDispatch()

  const groups = useSelector(selectGroups)

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
          onSuggestionItemClick(null, e)
          if (e.ctrlKey) {
            dispatch(showContextSearch())
            dispatch(setPreview({type: "user", first_name: suggestion.name, ...suggestion}))
          } else {
            dispatch(setManager({first_name: suggestion.name, ...suggestion}))
            dispatch(setContext("User"))
          }
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
              {suggestion.groups && suggestion.groups.length !== 0 && suggestion.groups.map((group) => (
                <span>
                  {getGroupName(groups, group.group_id, groupTypes[group.group_type])}
                </span>
              ))}

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



  return (
    <AutoComplete
      placeholder="Search"
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
