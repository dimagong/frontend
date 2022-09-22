export interface IProfile {
  avatar: null;
  email: string;
  first_name: string;
  groups: IGroups[];
  id: number;
  last_name: string;
  member_firm: IMemberFirm;
  member_firm_permissions: IMemberFirmPermissions;
  modules: any[];
  notify_entries: any[];
  number: string;
  permissions: IPermissions;
  postcode: any;
  roles: IRole[];
  status: string;
  valid_until: any;
}

export interface IGroups {
  created_at: null | string;
  group_id: number;
  group_type: string;
  id: number;
  type: string;
  updated_at: null | string;
  user_id: number;
}

export interface IMemberFirm {
  created_at: null | string;
  id: number;
  logo: ILogo | null;
  main_fields: { name: string; Address: string };
  master_schema_breadcrumbs: string;
  members_count: number;
  network_id: number;
  type: string;
  updated_at: null | string;
}

export interface IMemberFirmPermissions {
  role: IRole;
}
export interface IRole {
  id: number;
  member_firm_id: number;
  type: string;
  user_id: number;
}
export interface IPermissions {
  organization: string;
  organization_id: number;
  organization_type: string;
  ability: string;
  logo: ILogo | null;
}

export interface ILogo {
  created_at: string;
  entity_id: number;
  entity_type: string;
  group: string;
  id: number;
  mime_type: string;
  name: string;
  path: string;
  resource_manager_field_file_id: any;
  type: string;
  updated_at: string;
}

export interface IForm {
  access_type: string;
  id: number;
  name: string;
  status: string;
  type: string;
}
