import { Status } from "./../constants/statusConstants";
import { AccessTypes } from "../../../../components/DForm/types/accessTypes";

export interface Profile {
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
  access_type: Record<AccessTypes, string>;
  id: number;
  name: string;
  status: string;
  type: string;
}

export type DForm = {
  access_type: Record<AccessTypes, string>;
  id: number;
  name: string;
  status: Record<Status, string>;
};

export type Survey = {
  created_at: string | null;
  finished_at: string | null;
  graded_at: string | null;
  id: number;
  interaction_version: { description: string; is_can_return: boolean; min_percent_pass: number };
  is_show_result: boolean;
  order: number;
  started_at: string | null;
  stats: null | {
    total: string | number;
    min_percent_pass: string | number;
    max_percent_pass: string | number;
    totalTime: string | number;
  };
  title: string;
};

export type DFormCategory = {
  dform_id: number;
  dform_name: string;
  dform_status: Record<Status, string>;
  dform_access_type: Record<AccessTypes, string>;
  category_id: number;
  category_parent: number;
  category_name: string;
  dform_created_at: string | null;
  dform_updated_at: string | null;
  dform_description: string;
};
