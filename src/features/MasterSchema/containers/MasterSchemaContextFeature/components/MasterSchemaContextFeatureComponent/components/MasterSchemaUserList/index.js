import "./styles.scss";

import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { capitalize, get } from "lodash/fp";
import { ExternalLink } from "react-feather";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, CardBody, CardHeader } from "reactstrap";

import appSlice from "app/slices/appSlice";
import { useBoolean } from "hooks/use-boolean";
import SearchAndFilter from "components/SearchAndFilter";
import MSEButton from "features/MasterSchema/share/mse-button";
import SurveyModal from "features/Surveys/Components/SurveyModal";
import { selectOrganizations } from "app/selectors/groupSelector";
import { getMemberFirms } from "app/selectors/memberFirmsSelector";
import { FilterMemberFirmsOptions, FilterOrganizationsOptions, FilterRolesOptions } from "constants/filter";

import BackInTimeIcon from "assets/img/svg/back-in-time.svg";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

// eslint-disable-next-line no-unused-vars
const MOCK_USERS = [
  {
    id: 7,
    first_name: "multiple",
    last_name: "files",
    field: {
      id: 17,
      name: "number",
      value: "",
      type: "files",
      date: "2021-10-21T10:57:53.000000Z",
      files: [{ name: "File1.jpg" }, { name: "File1.jpg" }],
      provided: {
        id: 1,
        email: "nmpadmin@webinspire.com.au",
        first_name: "Admin",
        last_name: "Padberg",
        avatar: {
          id: 5,
          name: "doge.jpg",
          mime_type: "image/jpeg",
          path: "user/1/avatar/5/doge.jpg",
          type: "s3",
          entity_id: 1,
          group: "avatar",
          entity_type: "user",
          created_at: "2021-09-06T08:59:40.000000Z",
          updated_at: "2021-12-16T21:40:02.000000Z",
        },
        avatar_path:
          "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
      },
    },
    avatar: null,
    permissions: {
      organization: "ValidPath",
      organization_id: 1,
      organization_type: "network",
      ability: "prospect",
      logo_path: "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/organization-logo/network/1",
      logo: {
        id: 3,
        name: "ValidPath.png",
        mime_type: "image/png",
        path: "organization/network/1/logo/3/ValidPath.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "App\\Network",
        created_at: "2021-09-04T00:49:57.000000Z",
        updated_at: "2021-09-04T00:49:57.000000Z",
      },
    },
    avatar_path: null,
    member_firm: {
      id: 2,
      network_id: 1,
      created_at: "2021-10-15T08:48:49.000000Z",
      updated_at: "2021-10-15T08:48:49.000000Z",
      laravel_through_key: 7,
      numberOfMembers: 4,
      type: "member_firm",
      logo: {
        id: 461,
        name: "22.jpg",
        mime_type: "image/jpeg",
        path: "organization/member_firm/2/logo/461/22.jpg",
        type: "s3",
        entity_id: 2,
        group: "org_logo",
        entity_type: "memberFirm",
        created_at: "2021-11-09T14:27:14.000000Z",
        updated_at: "2021-11-09T14:27:14.000000Z",
      },
      logo_path:
        "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/member-firm/2/logo?timestamp=1639693098",
      main_fields: {
        name: "",
        email: "",
        contactNumber: "",
        Address: "",
        msnewfield1: "",
        qweqwe: "",
        qwedsazxc: "",
      },
      master_schema_breadcrumbs: "ValidPath.MemberFirm.Unapproved",
      name: "MemberFirmName",
    },
    member_firm_permissions: {
      role: {
        id: 7,
        member_firm_id: 2,
        user_id: 7,
        type: "principal",
      },
    },
    versions_total: 2,
    history: {
      fieldId: 17,
      versions: [
        {
          id: 12,
          value: "",
          type: "files",
          files: [{ name: "File1.jpg" }, { name: "File1.jpg" }],
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
        {
          id: 13,
          value: "",
          type: "files",
          files: [{ name: "File1.mp3" }, { name: "File1.mp3" }],
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
      ],
    },
  },
  {
    id: 123,
    first_name: "multiple",
    last_name: "files",
    field: {
      id: 432,
      name: "number",
      value: "",
      type: "file",
      date: "2021-10-21T10:57:53.000000Z",
      files: [{ name: "File1.jpg" }],
      provided: null,
    },
    avatar: null,
    permissions: {
      organization: "ValidPath",
      organization_id: 1,
      organization_type: "network",
      ability: "prospect",
      logo_path: "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/organization-logo/network/1",
      logo: {
        id: 3,
        name: "ValidPath.png",
        mime_type: "image/png",
        path: "organization/network/1/logo/3/ValidPath.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "App\\Network",
        created_at: "2021-09-04T00:49:57.000000Z",
        updated_at: "2021-09-04T00:49:57.000000Z",
      },
    },
    avatar_path: null,
    member_firm: {
      id: 2,
      network_id: 1,
      created_at: "2021-10-15T08:48:49.000000Z",
      updated_at: "2021-10-15T08:48:49.000000Z",
      laravel_through_key: 7,
      numberOfMembers: 4,
      type: "member_firm",
      logo: {
        id: 461,
        name: "22.jpg",
        mime_type: "image/jpeg",
        path: "organization/member_firm/2/logo/461/22.jpg",
        type: "s3",
        entity_id: 2,
        group: "org_logo",
        entity_type: "memberFirm",
        created_at: "2021-11-09T14:27:14.000000Z",
        updated_at: "2021-11-09T14:27:14.000000Z",
      },
      logo_path:
        "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/member-firm/2/logo?timestamp=1639693098",
      main_fields: {
        name: "",
        email: "",
        contactNumber: "",
        Address: "",
        msnewfield1: "",
        qweqwe: "",
        qwedsazxc: "",
      },
      master_schema_breadcrumbs: "ValidPath.MemberFirm.Unapproved",
      name: "MemberFirmName",
    },
    member_firm_permissions: {
      role: {
        id: 7,
        member_firm_id: 2,
        user_id: 7,
        type: "principal",
      },
    },
    versions_total: 100,
    history: {
      fieldId: 432,
      versions: [
        {
          id: 12,
          value: "",
          type: "file",
          files: [{ name: "File1.jpg" }],
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
      ],
    },
  },
  {
    id: 6,
    first_name: "Survey",
    last_name: "Styles",
    field: {
      id: 5,
      name: "number",
      value: true,
      type: "boolean",
      date: "2021-09-21T12:34:02.000000Z",
      files: null,
      provided: null,
    },
    avatar: null,
    permissions: {
      organization: "ValidPath",
      organization_id: 1,
      organization_type: "network",
      ability: "prospect",
      logo_path: "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/organization-logo/network/1",
      logo: {
        id: 3,
        name: "ValidPath.png",
        mime_type: "image/png",
        path: "organization/network/1/logo/3/ValidPath.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "App\\Network",
        created_at: "2021-09-04T00:49:57.000000Z",
        updated_at: "2021-09-04T00:49:57.000000Z",
      },
    },
    avatar_path: null,
    member_firm: {
      id: 1,
      network_id: 1,
      created_at: "2021-09-06T14:47:58.000000Z",
      updated_at: "2021-09-06T14:47:58.000000Z",
      laravel_through_key: 6,
      numberOfMembers: 1,
      type: "member_firm",
      logo: {
        id: 8,
        name: "test3.png",
        mime_type: "image/png",
        path: "organization/member_firm/1/logo/8/test3.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "memberFirm",
        created_at: "2021-09-08T09:47:26.000000Z",
        updated_at: "2021-09-08T09:47:26.000000Z",
      },
      logo_path:
        "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/member-firm/1/logo?timestamp=1639693098",
      main_fields: {
        name: "",
        email: "",
        contactNumber: "",
        Address: "",
      },
      master_schema_breadcrumbs: "ValidPath.MemberFirm.Unapproved",
    },
    member_firm_permissions: {
      role: {
        id: 6,
        member_firm_id: 1,
        user_id: 6,
        type: "member",
      },
    },
    versions_total: 1,
    history: {
      fieldId: 5,
      versions: [
        {
          id: 12,
          value: true,
          type: "boolean",
          files: null,
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
      ],
    },
  },
  {
    id: 10,
    first_name: "Onboarding",
    last_name: "Test",
    field: {
      id: 32,
      name: "number",
      value: "<h1>Dangerous html value</h1>",
      type: "string",
      date: "2021-11-09T11:23:19.000000Z",
      files: null,
      provided: null,
    },
    avatar: null,
    permissions: {
      organization: "ValidPath",
      organization_id: 1,
      organization_type: "network",
      ability: "prospect",
      logo_path: "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/organization-logo/network/1",
      logo: {
        id: 3,
        name: "ValidPath.png",
        mime_type: "image/png",
        path: "organization/network/1/logo/3/ValidPath.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "App\\Network",
        created_at: "2021-09-04T00:49:57.000000Z",
        updated_at: "2021-09-04T00:49:57.000000Z",
      },
    },
    avatar_path: null,
    member_firm: null,
    member_firm_permissions: null,
    versions_total: 1,
    history: {
      fieldId: 32,
      versions: [
        {
          id: 12,
          value: "<h1>Dangerous html value</h1>",
          type: "string",
          files: null,
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
      ],
    },
  },
  {
    id: 4,
    first_name: "Prospect2",
    last_name: "Runolfsdottir",
    field: {
      id: 10,
      name: "number",
      value: "just a string",
      type: "string",
      date: "2021-10-04T08:55:42.000000Z",
      files: null,
      provided: null,
    },
    avatar: {
      id: 462,
      name: "pink_floyd_dispersion_2-wallpaper-2560x1600.jpg",
      mime_type: "image/jpeg",
      path: "user/4/avatar/462/pink_floyd_dispersion_2-wallpaper-2560x1600.jpg",
      type: "s3",
      entity_id: 4,
      group: "avatar",
      entity_type: "user",
      created_at: "2021-12-02T16:30:06.000000Z",
      updated_at: "2021-12-16T21:40:03.000000Z",
    },
    permissions: {
      organization: "ValidPath",
      organization_id: 1,
      organization_type: "network",
      ability: "prospect",
      logo_path: "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/organization-logo/network/1",
      logo: {
        id: 3,
        name: "ValidPath.png",
        mime_type: "image/png",
        path: "organization/network/1/logo/3/ValidPath.png",
        type: "s3",
        entity_id: 1,
        group: "org_logo",
        entity_type: "App\\Network",
        created_at: "2021-09-04T00:49:57.000000Z",
        updated_at: "2021-09-04T00:49:57.000000Z",
      },
    },
    avatar_path:
      "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/4/avatar/462/pink_floyd_dispersion_2-wallpaper-2560x1600.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214003Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=49ecec033c96b06572790eb096020c62722e0967b937fb6b425d84d26e78d40f",
    member_firm: {
      id: 2,
      network_id: 1,
      created_at: "2021-10-15T08:48:49.000000Z",
      updated_at: "2021-10-15T08:48:49.000000Z",
      laravel_through_key: 4,
      numberOfMembers: 4,
      type: "member_firm",
      logo: {
        id: 461,
        name: "22.jpg",
        mime_type: "image/jpeg",
        path: "organization/member_firm/2/logo/461/22.jpg",
        type: "s3",
        entity_id: 2,
        group: "org_logo",
        entity_type: "memberFirm",
        created_at: "2021-11-09T14:27:14.000000Z",
        updated_at: "2021-11-09T14:27:14.000000Z",
      },
      logo_path:
        "http://nmpdevv1-env.eba-xfzbdsum.eu-west-2.elasticbeanstalk.com/api/file/member-firm/2/logo?timestamp=1639693098",
      main_fields: {
        name: "",
        email: "",
        contactNumber: "",
        Address: "",
        msnewfield1: "",
        qweqwe: "",
        qwedsazxc: "",
      },
      master_schema_breadcrumbs: "ValidPath.MemberFirm.Unapproved",
    },
    member_firm_permissions: {
      role: {
        id: 4,
        member_firm_id: 2,
        user_id: 4,
        type: "member",
      },
    },
    versions_total: 1,
    history: {
      fieldId: 10,
      versions: [
        {
          id: 12,
          value: "just a string",
          type: "string",
          files: null,
          created_at: "2021-12-16T17:56:40.000000Z",
          updated_at: "2021-12-16T17:56:40.000000Z",
          provided: {
            id: 1,
            email: "nmpadmin@webinspire.com.au",
            first_name: "Admin",
            last_name: "Padberg",
            avatar: {
              id: 5,
              name: "doge.jpg",
              mime_type: "image/jpeg",
              path: "user/1/avatar/5/doge.jpg",
              type: "s3",
              entity_id: 1,
              group: "avatar",
              entity_type: "user",
              created_at: "2021-09-06T08:59:40.000000Z",
              updated_at: "2021-12-16T21:40:02.000000Z",
            },
            avatar_path:
              "https://nmp-dev.s3.eu-west-2.amazonaws.com/user/1/avatar/5/doge.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAV55RTVV6NJI3CTVT%2F20211216%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T214002Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=25e05ed2ee4e383baa94fe9bf1991557fd63ff7a6a23d3c6e90d1ee1253fe2c3",
          },
        },
      ],
    },
  },
];

// :: (field) -> string
const normalizeFieldValue = (field) => {
  if (!field.type) return null;

  switch (field.type) {
    case "files":
      if (!field.files) {
        return null;
      }
      return field.files.map(get("name")).join(", ");
    case "file":
      if (!field.files) {
        return null;
      }
      return field.files.map(get("name"))[0];
    case "boolean":
      return field.value ? "Yes" : "No";
    default:
      return field.value;
  }
};

const normalizeVersionTotal = (total) => (total > 9 ? "+9" : total);

const getFullName = ({ first_name, last_name }) => `${first_name} ${last_name}`;

const TEMP_LONG_VALUE_LENGTH = 15;

const isValueLong = (v) => v.length > TEMP_LONG_VALUE_LENGTH;

const ValueCell = ({ value, files, type, onLongValueClick }) => {
  const fieldType = capitalize(type || "");
  const normalizeValue = normalizeFieldValue({ value, files, type });

  if (normalizeValue && isValueLong(normalizeValue)) {
    return (
      <MSEButton className="d-flex align-items-center msu-table__value-button" onClick={onLongValueClick}>
        <div>This is a long text</div>
        <ExternalLink size="12" />
      </MSEButton>
    );
  }

  return (
    <>
      {fieldType && <div>{`${fieldType}: `}</div>}
      {normalizeValue && <div className="msu-table__field-value">{normalizeValue}</div>}
    </>
  );
};

const MasterSchemaUserList = ({ users, selected, setUsersFiltered }) => {
  // users = MOCK_USERS;
  const dispatch = useDispatch();

  const memberFirmsInfo = useSelector(getMemberFirms);
  const organizationsInfo = useSelector(selectOrganizations);

  const filterTypes = {
    roles: FilterRolesOptions(),
    organizations: FilterOrganizationsOptions(),
    memberFirms: FilterMemberFirmsOptions(),
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [valueModal, openValueModal, closeValueModal] = useBoolean(false);
  const [historyModal, openHistoryModal, closeHistoryModal] = useBoolean(false);

  const [searchInput, setSearchInput] = useState("");
  const [filterOptions, setFilterOptions] = useState({});

  const onLongValueClick = (value) => () => {
    setSelectedValue(normalizeFieldValue(value));
    openValueModal();
  };

  const onVersionClick = (user) => () => {
    setSelectedUser(user);
    openHistoryModal();
  };

  const onFilterCancel = () => {
    setFilterOptions({});
    setUsersFiltered(false);
  };

  const onFilterSubmit = (filterOptions, filter) => {
    setFilterOptions(filter);
    setUsersFiltered(true);
  };

  const onSearchSubmit = (value) => {
    if (value.target.value.length !== 1) {
      setSearchInput(value.target.value);
      setUsersFiltered(true);
    }
  };

  const onFilterOptionCancel = (option) => {
    setFilterOptions(onFilterOptionCancel.cancelOption[option]);
  };

  onFilterOptionCancel.cancelOption = {
    roles: () => {
      return { ...filterOptions, roles: [] };
    },
    organizations: () => {
      return { ...filterOptions, organizations: [] };
    },
    memberFirms: () => {
      return { ...filterOptions, memberFirms: [] };
    },
  };

  useEffect(() => {
    const orgatizationsToFilter = filterOptions.organizations
      ? _.intersectionBy(
          organizationsInfo,
          filterOptions.organizations.map((item) => {
            return { name: item };
          }),
          "name"
        ).map((item) => {
          return { ...item, type: item.logo.entity_type };
        })
      : [];

    const memberFirmsToFilter = filterOptions.memberFirms
      ? _.intersectionBy(
          memberFirmsInfo,
          filterOptions.memberFirms.map((item) => {
            return { main_fields: { name: item } };
          }),
          "main_fields.name"
        ).map((item) => item.id)
      : [];

    const payload = {
      fieldId: selected.field.id,
      abilities: filterOptions?.roles ? filterOptions.roles.map((item) => item.toLowerCase().replace(" ", "_")) : [],
      organizations: orgatizationsToFilter,
      member_firm_id: memberFirmsToFilter,
      name: searchInput,
    };

    dispatch(getUsersByMasterSchemaFieldRequest(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, filterOptions, dispatch]);

  return (
    <>
      {users && !users.length && <h3 className="ms-nothing-was-found">No users found for your query</h3>}

      <Card className="px-1 ms-user-list" style={{ boxShadow: "none", border: "1px solid #ececec" }}>
        <CardHeader className="px-0">
          <div className="w-100">
            <SearchAndFilter
              handleSearch={onSearchSubmit}
              onCancelFilter={onFilterCancel}
              filterTypes={filterTypes}
              applyFilter={onFilterSubmit}
              onFilterOptionCancel={onFilterOptionCancel}
              filterTabPosition={"left"}
            />
          </div>
        </CardHeader>

        <CardBody className="pt-0 pb-1 px-0">
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr className="msu-table__users-head">
                <th className="msu-table__avatar">&nbsp;</th>
                <th className="msu-table__name">Name</th>
                <th>Role</th>
                <th>Member firm</th>
                <th className="msu-table__value">Value</th>
                <th className="msu-table__value">User</th>
                <th>Date</th>
                <th className="msu-table__total">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const fullName = getFullName(user);
                const { field, permissions } = user;
                const { provided } = field;
                const avatarPath = user.avatar_path || NoneAvatar;
                const providedFullName = provided ? getFullName(provided) : null;
                const role = capitalize(permissions?.ability || "");
                const memberFirm = user.member_firm?.name;
                const versionsTotal = user.versions_total ?? 0;
                const normalizedVersionsTotal = normalizeVersionTotal(versionsTotal);

                return (
                  <tr className="msu-table__row--shadowed-partial" key={user.id}>
                    <td className="msu-table__avatar">
                      <img
                        className="msu-table__avatar-img"
                        src={avatarPath}
                        width="40"
                        height="40"
                        alt="user's avatar."
                      />
                    </td>

                    <td className="msu-table__name pl-1">{fullName}</td>

                    <td>{role}</td>

                    <td>{memberFirm}</td>

                    <td className="msu-table__value">
                      <ValueCell
                        value={field.value}
                        files={field.files}
                        type={field.type}
                        onLongValueClick={onLongValueClick(user.field)}
                      />
                    </td>

                    <td className="msu-table__name">{providedFullName}</td>

                    <td className="msu-table__date--end msu-table__date--bordered">
                      <div>{moment(user.field.date).format("DD/MM/YYYY")}</div>
                      <div>{moment(user.field.date).format("HH:MM")}</div>
                    </td>

                    <td className="msu-table__total">
                      <button className="msu-table__versioning-button" onClick={onVersionClick(user)}>
                        <span className="msu-table__versioning-number" title={versionsTotal}>
                          {normalizedVersionsTotal}
                        </span>
                        <img className="msu-table__versioning-img" src={BackInTimeIcon} alt="versions-modal" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {selectedValue && (
        <SurveyModal isOpen={valueModal} title="Extended input" onClose={closeValueModal} actions={false}>
          <div className="py-2" dangerouslySetInnerHTML={{ __html: selectedValue }} />
        </SurveyModal>
      )}

      {selectedUser && (
        <SurveyModal
          className="element-history"
          isOpen={historyModal}
          title="Element history"
          onClose={closeHistoryModal}
          actions={false}
        >
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr className="msu-table__history-head">
                <th>Date</th>
                <th className="msu-table__value">Value</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {selectedUser.history.versions.map((version) => {
                const { provided } = version;
                const fullName = provided ? getFullName(provided) : null;
                return (
                  <tr className="msu-table__row--history" key={version.id}>
                    <td className="msu-table__date--start">
                      <div>{moment(version?.created_at).format("DD/MM/YYYY")}</div>
                      <div>{moment(version?.created_at).format("HH:MM")}</div>
                    </td>
                    <td className="msu-table__value">
                      <ValueCell
                        type={version.type}
                        value={version.value}
                        files={version.files}
                        onLongValueClick={onLongValueClick(version)}
                      />
                    </td>
                    <td>{fullName}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </SurveyModal>
      )}
    </>
  );
};

MasterSchemaUserList.propTypes = {
  users: PropTypes.array.isRequired,
  hierarchy: PropTypes.object.isRequired,
};

export default MasterSchemaUserList;
