import React from 'react';
import { Search } from "@material-ui/icons";
import RefreshIcon from 'assets/img/svg/refresh.svg';

import './styles.scss'
import Select from "react-select";
import {Button} from "react-bootstrap";

const MSMapping = ({document, versions}) => {

  const selectStyles = {
    container: styles => ({...styles, width: '58%', marginRight: 25, color: '#707070'}),
    control: styles => ({...styles,
      color: '#707070',
      border: 0,
      borderBottom: '1px solid #707070',
      borderRadius: 0,
      boxShadow: 'none'
    }),
    singleValue: styles => ({...styles, color: 'rgba(112, 112, 112, 0.721569)'}),
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="title">
          Document Mapping
        </div>
      </div>
      { document?.id ?
          <div className={'ms-mapping'}>
            <div className={'ms-mapping-container'}>
              <div className={'d-flex align-items-center justify-content-between'}>
                <img src={RefreshIcon} alt={'refresh'} className={'ms-mapping-refresh'}/>
                  <Select
                    options={versions.map(item => {return {value: item, label: item.name + ' ' + item.version}})}
                    defaultValue={{value: versions[0], label: versions[0].name + ' ' + versions[0].version}}
                    styles={selectStyles}
                  />
                <div className="ms-mapping-search-input-container search-input-container">
                  <Search className="search-input-icon" />
                  <input className="search-input-custom" type="text"/>
                </div>
              </div>

              <div className={'ms-mapping-main-container'}>
                {document.types.map(element => (
                  <div className={'ms-mapping-main-container-item d-flex align-items-center justify-content-between'}>
                    <span className={'ms-mapping-main-container-ms-type'}>{`{{ msRef: ${element} }}`}</span>
                    <Select
                      options={document.types.map(item => {return {value: item, label: 'MS.ValidPath.profile.' + item}})}
                      styles={selectStyles}
                      placeholder={'Select a MasterSchema reference'}
                    />
                  </div>
                  ))}
              </div>

              <div className={'ms-mapping-preview d-flex'}>
                <Select
                  options={document.types.map(item => {return {value: item, label: 'MS.ValidPath.profile.' + item}})}
                  styles={selectStyles}
                  placeholder={'Select a user to preview prefilled document against'}
                />
                <Button variant="primary" onClick={() => {}}>Preview</Button>
              </div>
            </div>

            <div className={'ms-mapping-footer d-flex align-items-center justify-content-between'}>
              <Button variant="primary" className={'ms-mapping-footer-cancel'} onClick={() => {}}>Cancel</Button>
              <Button variant="primary" className={'ms-mapping-footer-save'} onClick={() => {}}>Save</Button>
            </div>

          </div>
        : <div className="d-flex justify-content-center pt-5 text-black-50 font-large-1">
          No connections found
        </div>
      }
    </div>
  )
};

export default MSMapping;
