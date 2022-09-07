import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { IdType } from "utility/prop-types";
import NoneAvatar from "assets/img/portrait/none-avatar.png";
import {
  useMemberFirmLogoQuery,
  useUpdateMemberFirmLogoMutation,
  useDeleteMemberFirmLogoMutation,
} from "api/file/useMemberFirmLogoQueries";

import DeprecatedNmpManageableImage from "../DeprecatedNmpManageableImage";

const NmpMemberFirmLogo = ({ fileId, memberFirmId, isEditable = false, ...attrs }) => {
  const updateMutation = useUpdateMemberFirmLogoMutation({ memberFirmId });
  const onChange = useCallback((file) => updateMutation.mutate({ file }), [updateMutation]);

  const deleteMutation = useDeleteMemberFirmLogoMutation({ memberFirmId });
  const onDelete = useCallback(() => deleteMutation.mutate(), [deleteMutation]);

  const logoQuery = useMemberFirmLogoQuery({ memberFirmId }, { enabled: Boolean(fileId) });
  const src = useMemo(() => (logoQuery.data.url ? logoQuery.data.url : NoneAvatar), [logoQuery.data.url]);

  return (
    <DeprecatedNmpManageableImage
      src={src}
      alt="member firm logo"
      onChange={onChange}
      onDelete={onDelete}
      isEditable={isEditable}
      isRemovable={Boolean(fileId)}
      isLoading={logoQuery.isLoading || updateMutation.isLoading || deleteMutation.isLoading}
      {...attrs}
    />
  );
};

NmpMemberFirmLogo.propTypes = {
  fileId: IdType,
  memberFirmId: IdType.isRequired,
  isEditable: PropTypes.bool,
};

export default NmpMemberFirmLogo;
