import React from "react";

import FullLayout from "layouts/FullpageLayout";
import VerticalLayout from "layouts/VerticalLayout";

const ContextLayout = React.createContext();

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <ContextLayout.Provider value={{ fullLayout: FullLayout, VerticalLayout: VerticalLayout }}>
        {children}
      </ContextLayout.Provider>
    );
  }
}

export { Layout, ContextLayout };
