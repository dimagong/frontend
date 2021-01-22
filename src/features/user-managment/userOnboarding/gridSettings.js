import {RefreshCw} from "react-feather";
import {Button} from "reactstrap"
import React from "react";
import RefreshDFormFromParent from "./parts/RefreshDFormFromParent";

export const columnDefs = [
  {
    name: 'DForm',
    cell: (onboarding) => {
      return onboarding.d_form.name
    }
  },
  {
    name: 'Reviewers',
    cell: (onboarding) => {
      console.log('onboarding', onboarding);
      return onboarding.reviewers.map(reviewer => reviewer.first_name + ' ' + reviewer.last_name).join(', ')
    }
  },
  {
    name: 'Workflow',
    cell: (onboarding) => {
      return onboarding.workflow.name;
    }
  },
  {
    name: 'Private',
    cell: (onboarding) => {
      if (onboarding.is_internal) {
        return 'For reviewers only'
      }
      return ''
    }
  },
  {
    name: 'Up to date',
    cell: (onboarding) => {


      // send api/dform/{id}/update-from-parent

      return onboarding.d_form.up_to_date ?
        'Yes' : <RefreshDFormFromParent id={onboarding.d_form.id} />

    }
  },
];
