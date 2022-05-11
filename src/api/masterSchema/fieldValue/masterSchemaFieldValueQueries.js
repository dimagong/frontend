import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";

export const MasterSchemaFieldValueQueryKey = createQueryKey("master-schema-field-value");

export const MasterSchemaFieldValueQueryKeys = {
  all: () => [MasterSchemaFieldValueQueryKey],
  get: ({ userId, fieldId }) => [...MasterSchemaFieldValueQueryKeys.all(), { userId, fieldId }],
};

export const useMasterSchemaFieldValueHistory = ({ userId, fieldId }, options) => {
  return useGenericQuery(
    {
      url: "/api/master-schema-field-value-version",
      queryKey: MasterSchemaFieldValueQueryKeys.get({ userId, fieldId }),
      params: {
        user_id: userId,
        master_schema_field_id: fieldId,
      },
    },
    options
  );
};
