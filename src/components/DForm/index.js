import React from 'react';
import propTypes from 'prop-types';

const DForm = () => {

  const data = {
    "type": "application",
    "name": "Dform name",
    "description": "description",
    "isPrivate": false,
    "sections": [
      {
        "name": "First section",
        "isProtected": false,
        "relatedGroups": ["group one", "second group"],
        "conditions": ""
      }
    ],
    "groups": {
      "group one": {
        "isProtected": false,
        "relatedFields": [1, 2, 3]
      },
      "second group": {
        "isProtected": false,
        "relatedFields": []
      }
    },
    "fields": {
      "1": {
        "isMasterSchemaRelated": false,
        "type": "helpText"
      },
      "2": {
        "isMasterSchemaRelated": true,
        "type": "longText"
      },
      "3": {
        "isMasterSchemaRelated": true,
        "type": "file"
      },
      "4": {
        "isMasterSchemaRelated": true,
        "type": "select"
      }
    }
  };


};

DForm.propTypes = {

};

export default DForm;
