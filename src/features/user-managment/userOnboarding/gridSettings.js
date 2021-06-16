import {RefreshCw} from "react-feather";
import {Button} from "reactstrap"
import React from "react";
import RefreshDFormFromParent from "./parts/RefreshDFormFromParent";

export const columnDefs = [
  {
    name: 'Name',
    cell: (application) => {
      if (application.questions) {
        return <div>{application.title} <b>Survey</b></div>
      } else {
        return `${application.d_form.name} Application`
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
      if (application.questions) {
        return "-"
      } else {
        return application.d_form.up_to_date ?
          'Yes' : <RefreshDFormFromParent id={application.d_form.id} />
      }
    }
  },
];
