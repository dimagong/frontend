const colorMultiSelect = '#007bff'; //#7367f0


export const prepareSelectData = (groups) => {

  let groupsMultiSelect = [];

  if (!groups) return groupsMultiSelect;


  groups.forEach(corporation => {
    groupsMultiSelect.push({
      value: {
        group_id: corporation.id,
        type: 'corporation'
      },
      // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})`,
      label: `${corporation.name}`,
      color: colorMultiSelect
    });
    corporation.networks.forEach(network => {
      groupsMultiSelect.push({
        value: {
          group_id: network.id,
          type: 'network'
        },
        // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})`,
        label: `${network.name}`,
        color: colorMultiSelect
      });
      network.member_firms.forEach(memberFirm => {
        groupsMultiSelect.push({
          value: {
            group_id: memberFirm.id,
            type: 'member_firm'
          },
          // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})->${memberFirm.name}(${memberFirm.id})`,
          label: `${memberFirm.name}`,
          color: colorMultiSelect
        });
      });
    });
  });


  return groupsMultiSelect;
}
