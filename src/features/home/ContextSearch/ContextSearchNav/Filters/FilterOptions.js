import React, {useState} from 'react'
import {
  Button,
} from 'reactstrap';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

const FilterOptions = ({ filter, curr, roles, organizations, handleFilterOptions }) => {
  const [upd, update] = useState(false);
  let currFilters, currFiltersSet;
  if (curr === 'reps') {
    return; //Temporary
  }
  switch (curr) {
    case 'roles': currFilters = Array.from(roles); currFiltersSet = roles; break;
    case 'organizations': currFilters = Array.from(organizations); currFiltersSet = organizations; break;
    case 'reps': /*TODO*/ break;
  }

  const handleFilter = (option, item) => {
    handleFilterOptions(option, item)
    update(!upd);
  }


  return currFilters.map(item => <Button className={'filter-option not-active'} variant="primary">
    <span className={'filter-name'}>{item}</span>
    <span className={'filter-right'}>
        <span>
          <span className={'filter-check' + ((!filter.roles.has(item) && !filter.organizations.has(item)) ? ' remove' : '')} onClick={() => handleFilter('remove', item)}><CloseIcon/></span>
          <span className={'filter-check' + ((filter.roles.has(item) || filter.organizations.has(item)) ? ' add' : '')} onClick={() => handleFilter('add', item)}><CheckIcon/></span>
        </span>
      </span>
  </Button>)
}

export default FilterOptions;
