import React from 'react';
import MSTreeElement from './master-schema-tree-element';

const element = (name, elements = []) => ({
  name,
  type: 'text',
  createdAt: new Date().toString().slice(0, 15),
  parent: elements.length > 0,
  elements
});

const TREE = {
  elements: [element('ValidPath', [
    element('WelcomeVPBrochure'),
    element('Succession'),
    element('FCA', [
      element('InvestmentBusiness'),
      element('HomeFinance'),
    ]),
  ])],
};

const MSElementTree = ({ elements }) => {
  return (
    <>
      {
        elements.length && elements.map(({ name, type, parent, createdAt, elements }) => (
          <MSTreeElement name={name} type={type} parent={parent} createdAt={createdAt} key={name}>
            {/*<MSElementTree elements={elements} />*/}
          </MSTreeElement>
        ))
      }
    </>
  );
};

// ToDo: Cover the case when the MSTree is empty

const MasterSchemaElements = () => {
  return (
    <div>
      <h3>MasterSchemaTree</h3>
      <input type="text" />

      <MSElementTree elements={TREE.elements} />
    </div>
  );
};

export default MasterSchemaElements;
