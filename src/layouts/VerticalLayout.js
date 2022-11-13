import React, { PureComponent } from "react";

import ContextSearch from "features/home/ContextSearch";

import Navbar from "./navbar/Navbar";

export default class VerticalLayout extends PureComponent {
  render() {
    return (
      <div className="wrapper vertical-layout theme-primary navbar-floating">
        <div className="app-content content">
          <Navbar />

          <div className="content-wrapper">
            <ContextSearch />

            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
