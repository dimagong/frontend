import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import {
  useUserAvatarQuery,
  useDeleteUserAvatarMutation,
  useUpdateUserAvatarMutation,
} from "api/file/useUserAvatarQueries";
import { IdType } from "utility/prop-types";
import NoneAvatar from "assets/img/portrait/none-avatar.png";

import DeprecatedNmpManageableImage from "../DeprecatedNmpManageableImage";

const DeprecatedNmpUserAvatar = ({
  fileId,
  userId,
  isOnboarding,
  isEditable = false,
  width,
  height,
  style,
  className,
}) => {
  const updateMutation = useUpdateUserAvatarMutation({ userId });
  const onChange = useCallback((file) => updateMutation.mutate({ file }), [updateMutation]);

  const deleteMutation = useDeleteUserAvatarMutation({ userId, fileId });
  const onDelete = useCallback(() => deleteMutation.mutate(), [deleteMutation]);

  const avatarQuery = useUserAvatarQuery({ userId, fileId, isOnboarding }, { enabled: Boolean(fileId) });
  const src = useMemo(() => (avatarQuery.data.url ? avatarQuery.data.url : NoneAvatar), [avatarQuery.data.url]);

  return (
    <DeprecatedNmpManageableImage
      src={src}
      alt="user's avatar."
      onChange={onChange}
      onDelete={onDelete}
      isEditable={isEditable}
      isRemovable={Boolean(fileId)}
      isLoading={avatarQuery.isLoading || updateMutation.isLoading || deleteMutation.isLoading}
      width={width}
      height={height}
      style={style}
      className={className}
    />
  );
};

DeprecatedNmpUserAvatar.propTypes = {
  fileId: IdType,
  userId: IdType.isRequired,
  isEditable: PropTypes.bool,
};

export default DeprecatedNmpUserAvatar;
