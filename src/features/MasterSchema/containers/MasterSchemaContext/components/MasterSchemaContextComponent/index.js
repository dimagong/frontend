import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import { Search } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import { useBoolean } from "hooks/use-boolean";
import { useFormField, useFormGroup } from "hooks/use-form";

import ContextTemplate from "components/ContextTemplate";

import { preventDefault } from "utility/event-decorators";

import MSETextField from "features/MasterSchema/share/mse-text-field";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest } = appSlice.actions;

const MasterSchemaContextComponent = ({ state }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);

  const { hierarchy, unapproved, selectable } = state;

  const [expanded] = useBoolean(true);
  const [search, setSearch] = useFormField("");
  const searchForm = useFormGroup({ search });

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const onSearchSubmit = preventDefault(() => {
    const payload = { id: selectedId, name: searchForm.values.search };
    dispatch(getMasterSchemaHierarchyRequest(payload));
  });

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!isEmpty(unapproved.fields) && <UnapprovedFieldsComponent fields={unapproved.fields} />}

      <div className="mb-2">
        <MSETextField onChange={onSearchChange} name="search" value={search.value} className="mse-search__input">
          {({ input }) => (
            <form onSubmit={onSearchSubmit}>
              <div className="mse-search d-flex">
                <button className="mse-search__icon" type="submit" tabIndex="0" aria-label="search">
                  <Search />
                </button>
                {input}
              </div>
            </form>
          )}
        </MSETextField>
      </div>

      <MasterSchemaElements expanded={expanded} selectable={selectable} hierarchy={hierarchy} key={hierarchy.name} />
    </ContextTemplate>
  );
};

MasterSchemaContextComponent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextComponent;
