import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { IdType } from "utility/prop-types";
import NoneAvatar from "assets/img/portrait/none-avatar.png";
import {
  useMemberFirmLogoQuery,
  useUpdateMemberFirmLogoMutation,
  useDeleteMemberFirmLogoMutation,
} from "api/file/useMemberFirmLogoQueries";

import NmpManageableImage from "../NmpManageableImage";

const NmpMemberFirmLogo = ({ fileId, memberFirmId, isEditable = false, className, style }) => {
  const updateMutation = useUpdateMemberFirmLogoMutation({ memberFirmId });
  const onChange = useCallback((file) => updateMutation.mutate({ file }), [updateMutation]);

  const deleteMutation = useDeleteMemberFirmLogoMutation({ memberFirmId });
  const onDelete = useCallback(() => deleteMutation.mutate(), [deleteMutation]);

  const logoQuery = useMemberFirmLogoQuery({ memberFirmId }, { enabled: Boolean(fileId) });
  const src = useMemo(() => (logoQuery.data.url ? logoQuery.data.url : NoneAvatar), [logoQuery.data.url]);

  return (
    <NmpManageableImage
      src={src}
      alt="member firm logo"
      onChange={onChange}
      onDelete={onDelete}
      isEditable={isEditable}
      isRemovable={Boolean(fileId)}
      isLoading={logoQuery.isLoading || updateMutation.isLoading || deleteMutation.isLoading}
      style={style}
      className={className}
    />
  );
};

NmpMemberFirmLogo.propTypes = {
  fileId: IdType,
  memberFirmId: IdType.isRequired,
  isEditable: PropTypes.bool,
};

export default NmpMemberFirmLogo;
