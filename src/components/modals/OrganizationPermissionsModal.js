import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Spinner } from "reactstrap";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import { isEmpty, capitalize } from "lodash";
import { Check } from "react-feather";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import axios from "api";

class AbilityService {
  allow({ user_id, organization_type, organization_id, ability }) {
    return axios.post("/api/ability/allow", {
      ability,
      organization_type,
      organization_id,
      user_id,
    });
  }

  disallow({ user_id, organization_type, organization_id, ability }) {
    return axios.post("/api/ability/disallow", {
      ability,
      organization_type,
      organization_id,
      user_id,
    });
  }

  getList({ user_id, organization_type, organization_id }) {
    return axios.post("/api/ability/organization", {
      organization_type,
      organization_id,
      user_id,
    });
  }
}

export default function OrganizationPermissionsModal(props) {
  const [isModalOpen, setModalOpenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [abilities, setAbilities] = useState([]);

  const abilityService = new AbilityService();

  useEffect(() => {
    if (isEmpty(props.organization)) {
      return;
    }
    getAbilities();
  }, [props.organization]);

  const getAbilities = async () => {
    setIsLoading(true);
    const response = await abilityService.getList({
      user_id: props.user.id,
      organization_id: props.organization.group_id,
      organization_type: props.organization.type,
    });
    setIsLoading(false);
    setModalOpenState(true);
    setAbilities(response.data.data);
  };

  const titleTransform = (title) => {
    if (!title) {
      return "";
    }
    return capitalize(title.replace("_", " "));
  };

  const changeAbility = async (toggle, ability) => {
    setIsLoading(true);
    try {
      if (toggle) {
        const response = await abilityService.allow({
          user_id: props.user.id,
          ability: ability,
          organization_id: props.organization.group_id,
          organization_type: props.organization.type,
        });
        setAbilities(response.data.data);
      } else {
        const response = await abilityService.disallow({
          user_id: props.user.id,
          ability: ability,
          organization_id: props.organization.group_id,
          organization_type: props.organization.type,
        });
        setAbilities(response.data.data);
      }
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={props.isOpen} className="modal-dialog-centered" backdrop={false}>
      <ModalHeader>
        <h2>{props.user.first_name + " " + props.user.last_name}</h2>
      </ModalHeader>
      <ModalBody>
        {!isModalOpen ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <div>
            <div>
              <Table responsive bordered>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{titleTransform(props.organization.name)}</td>
                  </tr>
                  <tr>
                    <td>Type</td>
                    <td>
                      <Chip color="primary" text={titleTransform(props.organization.type)} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <h4 className="text-center">Ability to manage as</h4>
            {Object.keys(abilities).map((ability) => {
              return (
                <Checkbox
                  disabled={isLoading}
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label={titleTransform(ability)}
                  checked={abilities[ability]}
                  onChange={(event) => {
                    changeAbility(event.target.checked, ability);
                  }}
                />
              );
            })}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={isLoading}
          color="primary"
          onClick={() => {
            props.onClose();
            setModalOpenState(false);
          }}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
