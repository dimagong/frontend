import axios from '../overrides/axios';

class AbilityService {
  allow({user_id, organization_type, organization_id, ability}) {
    return axios.post("/api/ability/allow", {
      ability,
      organization_type,
      organization_id,
      user_id,
    });
  }

  disallow({user_id, organization_type, organization_id, ability}) {
    return axios.post("/api/ability/disallow", {
      ability,
      organization_type,
      organization_id,
      user_id,
    });
  }

  getList({user_id, organization_type, organization_id}) {
    return axios.post("/api/ability/organization", {
      organization_type,
      organization_id,
      user_id,
    });
  }
}

const abilityService = new AbilityService();
Object.freeze(abilityService);

export default abilityService;
