import "./styles.scss";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "@material-ui/icons";

import appSlice from "app/slices/appSlice";
import { useBoolean } from "hooks/use-boolean";
import ContextTemplate from "components/ContextTemplate";
import { preventDefault } from "utility/event-decorators";
import { useFormField, useFormGroup } from "hooks/use-form";
import MSETextField from "features/MasterSchema/share/mse-text-field";
import { selectSelectedId } from "app/selectors/masterSchemaSelectors";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest } = appSlice.actions;

const MasterSchemaContextComponent = ({
  unapprovedFields,
  selectedMasterSchemaHierarchy,
  selectedUnapprovedFields,
  onUnapprovedFieldClick,
  onAllUnapprovedFieldsUnselect,
  onListOfUnapprovedElementsVisibilityToggle,
  isListOfUnapprovedElementsVisible,
}) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);

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
      {!!unapprovedFields.length && (
        <UnapprovedFieldsComponent
          fields={unapprovedFields}
          selectedFields={selectedUnapprovedFields}
          onFieldClick={onUnapprovedFieldClick}
          onUnselectAll={onAllUnapprovedFieldsUnselect}
          isListVisible={isListOfUnapprovedElementsVisible}
          onListVisibilityToggle={onListOfUnapprovedElementsVisibilityToggle}
        />
      )}

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

      <MasterSchemaElements
        expanded={expanded}
        hierarchy={selectedMasterSchemaHierarchy}
        key={selectedMasterSchemaHierarchy.name}
      />
    </ContextTemplate>
  );
};

export default MasterSchemaContextComponent;
