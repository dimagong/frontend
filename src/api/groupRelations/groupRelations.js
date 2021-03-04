import instance from "api";
import {groupRelationsPath, groupRelationsByUserIdPath} from 'constants/group'

const groupRelations = {
  async getGroupsRelations() {
    try {
      const result = await instance({
        url: groupRelationsPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getGroupsRelationsByUserId({userId}) {
    try {
      const result = await instance({
        url: groupRelationsByUserIdPath(userId),
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  }
};

export default groupRelations
