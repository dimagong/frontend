import React from "react";

function ErrorListTemplate(props) {
  const {errors} = props;
  return (
    <div>
      <h2>Custom error list</h2>
      <ul>
        {errors.map(error => (
          <li key={error.stack}>
            {error.stack}
          </li>
        ))}
      </ul>
    </div>
  );
}

