import React from 'react';

const MasterSchemaElementTree = () => {
  return (
    <div>
      <h3>MasterSchemaTree</h3>
      <input type="text" />

      <ul>
        <li>
          <strong>ValidPath</strong>
          <ul>
            <li>
              <strong>WelcomeVPBrochure</strong>
            </li>
            <li>
              <strong>Succession</strong>
            </li>
            <li>
              <strong>FCA</strong>
              <ul>
                <li>
                  <strong>InvestmentBusiness</strong>
                </li>
                <li>
                  <strong>HomeFinance</strong>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default MasterSchemaElementTree;
