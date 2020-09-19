const colorMultiSelect = "#007bff"; //#7367f0

export const prepareSelectOptions = (groups) => {
  let groupsMultiSelect = [];

  if (!groups) return groupsMultiSelect;

  groups.forEach((admin) => {
    groupsMultiSelect.push({
      value: {
        group_id: admin.id,
        type: "admin",
      },
      label: `${admin.name}`,
      // label: `${admin.name}(${admin.id})`,
      color: colorMultiSelect,
    });
    admin.corporations.forEach((corporation) => {
      groupsMultiSelect.push({
        value: {
          group_id: corporation.id,
          type: "corporation",
        },
        // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})`,
        label: `${corporation.name}`,
        color: colorMultiSelect,
      });
      corporation.networks.forEach((network) => {
        groupsMultiSelect.push({
          value: {
            group_id: network.id,
            type: "network",
          },
          // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})`,
          label: `${network.name}`,
          color: colorMultiSelect,
        });
        network.member_firms.forEach((memberFirm) => {
          groupsMultiSelect.push({
            value: {
              group_id: memberFirm.id,
              type: "member_firm",
            },
            // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})->${memberFirm.name}(${memberFirm.id})`,
            label: `${memberFirm.name}`,
            color: colorMultiSelect,
          });
        });
      });
    });
  });

  return groupsMultiSelect;
};

export const prepareSelectData = (groups) => {
  return groups.map((group) => {
    return {
      value: {
        group_id: group.id,
        type: group.type,
      },
      label: group.name,
      color: colorMultiSelect,
    };
  });
};

export const normalizeGroups = (groups) => {
  let groupsMultiSelect = [];

  if (!groups) return groupsMultiSelect;

  groups.forEach((admin) => {
    groupsMultiSelect.push({
      id: admin.id,
      name: admin.name,
      type: admin.type,
      updated_at: admin.updated_at,
      created_at: admin.created_at,
    });
    admin.corporations.forEach((corporation) => {
      groupsMultiSelect.push({
        id: corporation.id,
        name: corporation.name,
        type: corporation.type,
        updated_at: corporation.updated_at,
        created_at: corporation.created_at,
      });
      corporation.networks.forEach((network) => {
        groupsMultiSelect.push({
          id: network.id,
          name: network.name,
          type: network.type,
          updated_at: network.updated_at,
          created_at: network.created_at,
        });
        network.member_firms.forEach((memberFirm) => {
          groupsMultiSelect.push({
            id: memberFirm.id,
            name: memberFirm.name,
            type: memberFirm.type,
            updated_at: memberFirm.updated_at,
            created_at: memberFirm.created_at,
          });
        });
      });
    });
  });

  return groupsMultiSelect;
};
