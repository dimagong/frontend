import React from "react";

import UpdateApplicationToLatestVersion from "./parts/UpdateApplicationToLatestVersion";

export const columnDefs = [
  {
    name: 'Name',
    cell: (application) => {
      if (application.questions) {
        return <div>{application.title} <b>Survey</b></div>
      } else {
        return <div>{application.d_form.name} <b>Application</b></div>
      }

    }
  },
  {
    name: 'Reviewers',
    cell: (application) => {
      return application.reviewers.map(reviewer => reviewer.first_name + ' ' + reviewer.last_name).join(', ')
    }
  },
  {
    name: 'Workflows',
    cell: (application) => {
      return application.workflow.name;
    }
  },
  {
    name: 'Private',
    cell: (application) => {
      if (application.is_internal) {
        return 'For reviewers only'
      }
      return 'No'
    }
  },
  {
    name: 'Up to date',
    cell: (application) => {

      // send api/dform/{id}/update-from-parent
      return application?.d_form?.up_to_date || application?.intersection_version?.is_latest_version ?
        'Yes' : <UpdateApplicationToLatestVersion application={application} />
    }
  },
];
