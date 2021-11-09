import AutoComplete from "../@vuexy/autoComplete/AutoCompleteComponent";
import FilterIcon from "../../assets/img/svg/filter.svg";
import React, {useEffect, useRef, useState} from "react";
import FilterModal from "./Filter/FilterModal";
import {useDispatch} from "react-redux";
import {Button} from "reactstrap";
import CloseIcon from "@material-ui/icons/Close";

const SearchAndFilter = (props) => {
  const {
    handleSearch,
    handleFilter,
    setIsFiltered,
    onCancelFilter,
    potentialMembers
  } = props;

  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const wrapperRefFilterButton = useRef(null);
  const [filter, setFilter] = useState({roles: new Set(), organizations: new Set(), memberFirms: new Set(), type: {roles: 'initial', organizations: 'initial', memberFirms: 'initial'}});
  const [footerText, setFooterText] = useState({roles: '', organizations: '', memberFirms: ''});
  const [filterName, setFilterName] = useState('');
  const [curr, setCurr] = useState('roles');


  return <div>
    <div style={{width: 693, marginBottom: 20, marginTop: 10}}>
            <AutoComplete
              placeholder="Search"
              suggestions={[]}
              className="form-control"
              filterKey="name"
              onChange={handleSearch}
              suggestionLimit={4}
              defaultSuggestions={false}
              customRender={() => {}}
              showClear={true}
              hideSuggestions
            />
          </div>
          <img ref={wrapperRefFilterButton}
               className={'filter-icon member-firm-filter-icon'}
               src={FilterIcon} alt={'filter-icon'}
               onClick={() => {setIsFilterBoxOpen(!isFilterBoxOpen)}}
          />
          {isFilterBoxOpen && <FilterModal
            managers={potentialMembers}
            handleFilter={handleFilter}
            wrapperRefFilterButton={wrapperRefFilterButton}
            style={{left: 220, top: 50, marginBottom: 0}}
            filterTypes={['roles']}
            filter={filter}
            setFilter={setFilter}
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            curr={curr}
            setCurr={setCurr}
            footerText={footerText}
            setFooterText={setFooterText}
            filterName={filterName}
            setFilterName={setFilterName}
          />}

          <div style={{textAlign: 'right', paddingRight: 10, height: 30}}>
            {filter.roles.size > 0 && <Button className={'filter-tab member-firm-filter-tab'} variant={'dark'}>
              <span className={'nav-text'}>{footerText.roles.length <= 40 ? footerText.roles : `${filter.roles.size} roles`}</span>

              <span onClick={() => {
                setFilter({roles: new Set(), organizations: new Set(), memberFirms: new Set(), type: {roles: 'initial', organizations: 'initial', memberFirms: 'initial'}})
                setIsFiltered(false)
                onCancelFilter();
              }}
                    className={'close-nav'}><CloseIcon/></span>
            </Button>}
          </div>
  </div>



}

export default SearchAndFilter;
