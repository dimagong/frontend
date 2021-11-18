import React from 'react'
import {
  Button,
} from 'reactstrap';

const FilterOptions = ({ filter, curr, options, handleFilterOptions }) => {

  return options.map(item => <Button className={'filter-option not-active'} variant="primary">
    <span className={'filter-name'}>{item}</span>
    <span className={'filter-right'}>
        <span>
          <span className={'filter-check'} onClick={() => handleFilterOptions('remove', item)}>
            <svg style={filter.type[curr] === 'cross' && !filter[curr].find(el => el === item) ? {fill: '#dc3545', whiteSpace: 'pre', borderRadius: '6px'} : {fill: '#95989a', whiteSpace: 'pre', borderRadius: '6px'}}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" width="14" height="14">
			        <path id="squared-cross" fillRule="evenodd" className="shp0" d="M9.23 0.87C9.93 0.87 10.51 1.45 10.51 2.15L10.51 9.85C10.51 10.55 9.93 11.13 9.23 11.13L1.53 11.13C0.83 11.13 0.25 10.55 0.25 9.85L0.25 2.15C0.25 1.45 0.83 0.87 1.53 0.87L9.23 0.87ZM7.34 9.07L7.34 9.07L7.34 9.07L7.34 9.07ZM7.34 9.07L8.45 7.96L6.49 6L8.45 4.04L7.34 2.93L5.38 4.89L3.42 2.93L2.31 4.04L4.27 6L2.31 7.96L3.42 9.07L5.38 7.11L7.34 9.07Z"/>
            </svg>
          </span>
          <span className={'filter-check'} onClick={() => handleFilterOptions('add', item)}>
            <svg style={filter.type[curr] === 'check' && filter[curr].find(el => el === item) ? {fill: '#7367f0', whiteSpace: 'pre', borderRadius: '6px'} : {fill: '#95989a', whiteSpace: 'pre', borderRadius: '6px'}}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 12" width="14" height="14">
				      <path id="checkbox-checked" fillRule="evenodd" className="shp0" d="M10.88 2.15L10.88 9.85C10.88 10.55 10.3 11.13 9.6 11.13L1.9 11.13C1.2 11.13 0.62 10.55 0.62 9.85L0.62 2.15C0.62 1.45 1.2 0.87 1.9 0.87L9.6 0.87C10.3 0.87 10.88 1.45 10.88 2.15ZM5.11 8.83L9.09 4.85L8.18 3.94L5.11 7.02L3.64 5.55L2.73 6.45L5.11 8.83Z"/>
            </svg>
          </span>
        </span>
      </span>
  </Button>)
}

export default FilterOptions;
