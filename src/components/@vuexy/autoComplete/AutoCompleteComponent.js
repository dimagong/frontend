import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import { AlertTriangle } from "react-feather"
import {withRouter} from "react-router-dom"
import ClearIcon from "@material-ui/icons/Clear";
class Autocomplete extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSuggestion: 0,
      showSuggestions: false,
      userInput: "",
      focused: false,
      openUp: false
    }

    this.filteredData = []
    this.wrapperRef = React.createRef();
    this.containerRef = React.createRef();
    this.handleExternalClick = this.handleExternalClick.bind(this)
  }

  // Suggestion Click Event
  onSuggestionItemClick = (url, e) => {
    if (this.props.onSuggestionClick) {
      this.props.onSuggestionClick(e)
    }

    // If user input not equal to empty string and user input haven't been already remembered, then remember
    if (this.state.userInput !== "" && this.state.userInput.length > 2) {
      const repeats = this.state.recentSearches.filter((el) => el.toLowerCase() === this.state.userInput.toLowerCase())
      if(!repeats.length) {
        localStorage.setItem("recentSearches", JSON.stringify([this.state.userInput, ...this.state.recentSearches.slice(0,2)]))
        this.setState({
          recentSearches: [this.state.userInput, ...this.state.recentSearches.slice(0,2)]
        })
      }
    }

    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
    })
    if (url) this.props.history.push(url)
  }

  // Suggestion Hover Event
  onSuggestionItemHover = index => {
    this.setState({ activeSuggestion: index })
  }

  // Input Change
  onChange = e => {
    const userInput = e.currentTarget.value

    this.setState({
      userInput: userInput || "",
    })

    if (this.state.showSuggestions === true && !userInput) {
      this.setState({
        showSuggestions: false,
      })
    }

    if (this.state.showSuggestions === true && userInput && userInput.length < 3) {
      this.setState({
        showSuggestions: false,
      })
    }

    if(this.state.showSuggestions === false && userInput && userInput.length > 2) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: true,
        userInput: userInput || ""
      })
    }
    //
    // if (e.target.value && e.target.value.length < 3) {
    //   this.setState({
    //     showSuggestions: false
    //   })
    // }
  }

  // Input Click Event
  onInputClick = e => {
    e.stopPropagation()
  }

  // Input's Keydown Event
  onKeyDown = e => {
    const { activeSuggestion, userInput } = this.state
    let suggestionList = ReactDOM.findDOMNode(this.suggestionList)

    // User pressed the up arrow
    if (e.keyCode === 38 && activeSuggestion !== 0) {
      this.setState({ activeSuggestion: activeSuggestion - 1 })
      if (
        e.target.value.length > -1 &&
        suggestionList !== null &&
        activeSuggestion <= this.filteredData.length / 2
      ) {
        suggestionList.scrollTop = 0
      }
    }

    // User pressed the down arrow
    else if (
      e.keyCode === 40 &&
      activeSuggestion < this.filteredData.length - 1
    ) {
      this.setState({ activeSuggestion: activeSuggestion + 1 })

      if (
        e.target.value.length > -1 &&
        suggestionList !== null &&
        activeSuggestion >= this.filteredData.length / 2
      ) {
        suggestionList.scrollTop = suggestionList.scrollHeight
      }
    }

    // User Pressed ESC
    else if (e.keyCode === 27) {
      this.setState({
        showSuggestions: false,
        userInput: ""
      })
    }

    // User Pressed ENTER
    else if (e.keyCode === 13) {
      // this.onSuggestionItemClick(this.filteredData[activeSuggestion].link, e)
      /*if (this.filteredData[activeSuggestion]) {
        this.props.onEnter(this.filteredData[activeSuggestion])
      }*/
      this.props.onEnter(this.state.userInput);

      this.setState({
        //userInput: this.filteredData[activeSuggestion][filterKey],
        showSuggestions: false,
        focused: false
      })
    } else {
      return
    }

    // Custom Keydown Event
    if (
      this.props.onKeyDown !== undefined &&
      this.props.onKeyDown !== null &&
      this.props.onKeyDown
    ) {
      this.props.onKeyDown(e, userInput)
    }
  }

  filterSuggestions = (suggestions, suggestionsLimit) => {
    const {filterKey} = this.props;
    const {userInput} = this.state;

    return suggestions
      .filter(i => {
        let startCondition = i[filterKey]
            .toLowerCase()
            .startsWith(userInput.toLowerCase()),
          includeCondition = i[filterKey]
            .toLowerCase()
            .includes(userInput.toLowerCase())

        return startCondition || includeCondition;
      })
      .slice(0, suggestionsLimit)
  }

  // suggestion template
  renderSuggestion = (suggestion, filterKey, filteredData, activeSuggestion) => (
    <li
      className={classnames("suggestion-item", {
        active: this.filteredData.indexOf(suggestion) === activeSuggestion
      })}
      key={suggestion[filterKey]}
      onClick={e =>
        this.onSuggestionItemClick(suggestion.link ? suggestion.link : null, e)
      }
      onMouseEnter={() =>
        this.onSuggestionItemHover(this.filteredData.indexOf(suggestion))
      }>
      {suggestion[filterKey]}
    </li>
  )

  // Render list of suggestions
  renderSingleSuggestionsGroup = (suggestionsGroup, groupSuggestionsLimit) => {
    const { filterKey, customRender, suggestionLimit } = this.props
    const {
      onSuggestionItemClick,
      onSuggestionItemHover,
      state: { activeSuggestion, userInput }
    } = this

    let filteredSuggestions = this.filterSuggestions(suggestionsGroup, groupSuggestionsLimit || suggestionLimit)

    this.filteredData = filteredSuggestions

    if (!filteredSuggestions.length) {
      return (
        <li className="suggestion-item no-result">
          <AlertTriangle size={15} />{" "}
          <span className="align-middle ml-50">No Result</span>
        </li>
      )
    }

    return filteredSuggestions.map((suggestion, index) => {
      if (customRender) {
        return customRender(
          suggestion,
          index,
          filteredSuggestions,
          activeSuggestion,
          onSuggestionItemClick,
          onSuggestionItemHover,
          userInput
        )
      } else {
        return this.renderSuggestion(suggestion, filterKey, filteredSuggestions, activeSuggestion)
      }
    })
  }

  // render groups of suggestions
  renderSuggestionsGroups = (suggestionsGroup) => {
    const { filterHeaderKey } = this.props

    return (
      <React.Fragment key={suggestionsGroup[filterHeaderKey]}>
        <li className="suggestion-item suggestion-title text-primary text-bold-600">
          {suggestionsGroup[filterHeaderKey]}
        </li>
        {suggestionsGroup.map((suggestion) => (
          this.renderSingleSuggestionsGroup(suggestion.data)
        ))}
      </React.Fragment>
    )
  }

  // Render suggestions or groups of suggestions
  renderSuggestions = () => {
    const { grouped, suggestions } = this.props

    // Checks if suggestions are grouped or not.
    if (grouped === undefined || grouped === null || !grouped) {
      return this.renderSingleSuggestionsGroup(suggestions)
    } else {
      return suggestions.map(suggestion => (
        this.renderSuggestionsGroups(suggestion)
      ))
    }
  }

  // Clears Input
  clearInput = val => {
    if (this.props.clearInput && !val) {
      this.setState({
        userInput: ""
      })
    }
  }

  // Closes Suggestions if clicked outside container (On Blur Basically)
  handleExternalClick = e => {
    const { target } = e
    if (this.containerRef.current && !this.containerRef.current.contains(target)) {
      this.setState({
        showSuggestions: false
      })
      if (this.props.externalClick) this.props.externalClick(e)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { autoFocus, onSuggestionsShown, clearInput } = this.props
    // For searchbar focus
    if (this.wrapperRef.current && autoFocus) {
      this.wrapperRef.current.focus()
    }

    if (
      this.props.defaultSuggestions &&
      prevState.showSuggestions === false &&
      this.state.focused
    ) {
      this.setState({ showSuggestions: true })
    }

    if ( this.state.userInput && this.state.userInput.length > 2 &&
      prevState.showSuggestions === false &&
      this.state.focused
    ) {
      this.setState({ showSuggestions: true })
    }

    // Clear Input
    if (clearInput === false && this.state.userInput.length) {
      this.setState({
        userInput: ""
      })
    }

    // Function on Suggestions Shown
    if (onSuggestionsShown && this.state.showSuggestions) {
    onSuggestionsShown(this.state.userInput)
    }

    if (
      this.props.defaultSuggestions &&
      prevState.focused === false &&
      this.state.focused === true
    ) {
      this.setState({ showSuggestions: true })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleExternalClick);
    if (this.props.defaultSuggestions && this.state.focused) {
      this.setState({ showSuggestions: true })
    }
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches"))

    if (recentSearches === null) {
      localStorage.setItem("recentSearches", JSON.stringify([]))
      this.setState({ recentSearches: [] })
    } else {
      this.setState({ recentSearches })
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleExternalClick)
  }

  render() {
    const {
      onChange,
      onKeyDown,
      state: { showSuggestions, userInput, openUp }
    } = this
    let suggestionsListComponent

    if (showSuggestions) {
      suggestionsListComponent = (
        <PerfectScrollbar
          className={classnames("suggestions-list", {
            "open-up": openUp
          })}
          ref={el => (this.suggestionList = el)}
          component="ul"
          options={{ wheelPropagation: false }}>
          <div className="d-flex justify-content-between p-1">
            <span>Suggestions</span>
            <span style={{cursor: 'pointer'}} onClick={() => {
              this.props.onEnter(this.state.userInput);
              this.setState({
                showSuggestions: false,
                focused: false
              })}}>View all</span>
          </div>
          {this.renderSuggestions()}
          <div className="text-right px-1 pt-1">
            <span>Tip: Hold CTRL or CONTROL while clicking to show preview</span>
          </div>
          {!!this.state.recentSearches.length && (
            <div className="m-1 border-top-secondary ">
              <div className="py-1">Recent searches</div>
              {this.state.recentSearches.map((rs) => (
                <div
                  className="h5 cursor-pointer"
                  onClick={() => this.setState({userInput: rs})}
                >
                  {rs}
                </div>
              ))}
            </div>
          )}
        </PerfectScrollbar>
      )
    }

    return (
      <div
        className="vx-autocomplete-container"
        ref={this.containerRef}
      >
        <input
          ref={this.wrapperRef}
          type="text"
          onChange={e => {
            onChange(e)
            if (this.props.onChange) {
              this.props.onChange(e)
            }
          }}
          onKeyDown={e => onKeyDown(e)}
          value={userInput}
          style={{borderColor: "#707070"}}
          className={`vx-autocomplete-search ${
            this.props.className ? this.props.className : ""
          }`}
          placeholder={this.props.placeholder}
          onClick={this.onInputClick}
          onFocus={e => {
            this.setState({ focused: true })
          }}
          autoFocus={this.props.autoFocus}
          onBlur={e => {
            // this.onBlur(e)
            if (this.props.onBlur) this.props.onBlur(e)
            this.setState({ focused: false })
          }}
        />
        {this.props.hasOwnProperty('showClear') && this.props.showClear && this.state.userInput.length > 0 &&
          <span className={'clear-input'} onClick={() => {
            this.props.onEnter('');

            this.setState({
              userInput: '',
              showSuggestions: false,
              focused: false
            })
          }}><ClearIcon/></span>
        }
        {!this.props.hideSuggestions && suggestionsListComponent}
      </div>
    )
  }
}

export default withRouter(Autocomplete)

Autocomplete.propTypes = {
  suggestions: PropTypes.array.isRequired,
  filterKey: PropTypes.string.isRequired,
  filterHeaderKey: PropTypes.string,
  placeholder: PropTypes.string,
  suggestionLimit: PropTypes.number,
  grouped: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  onSuggestionsShown: PropTypes.func,
  onSuggestionItemClick: PropTypes.func,

}
