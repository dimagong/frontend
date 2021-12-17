import * as React from 'react';
import './index.scss'
import {Treebeard, decorators} from 'react-treebeard';
import {styleLight} from "./styles/style"
import classnames from "classnames"

class CustomContainer extends decorators.Container {
  render() {
    const { decorators, terminal, onClick, node } = this.props;
    if(!node.isVisible) {
      return <></>;
    }
    return (
      <div
        onClick={onClick}
        ref={ref => (this.clickableRef = ref)}
        className={classnames('ms-element', {'active': node.active, 'selected': node.selected, 'ms-group': !terminal})}
      >
        <decorators.Header node={node} />
      </div>
    );
  }
}

export default function MasterSchemaTree(props) {
  decorators.Header = (props) => {

    return <div onClick={() => {}}>
      <div style={{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}>{props.node.name}</div>
    </div>
  };
  decorators.Container = CustomContainer;

  return <Treebeard style={styleLight} data={props.data} onToggle={props.onToggle}/>;
}
