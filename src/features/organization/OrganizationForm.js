// import React, { useState } from "react";
// import { Button, Col, Row } from "reactstrap";
//
// import FileInput from "../../components/formElements/FileInput";
//
// export const OrganizationForm = ({ title: initialTitle, logo: initialLogo, logoIsLoading, submitText, onSubmit: propOnSubmit }) => {
//   const [title, setTitle] = useState(initialTitle);
//   const [logo, setLogo] = useState(initialLogo);
//
//   const onSubmit = (event) => {
//     event.preventDefault();
//
//     propOnSubmit({ title, logo });
//   };
//
//   return (
//     <Row tag="form" onSubmit={onSubmit}>
//       <Col className="organization-form" md="12">
//         <div className="field">
//           <div className="label">
//             <label htmlFor="title">Title</label>
//           </div>
//           <div className="form-element">
//             <input
//               type="text"
//               name="title"
//               id="title"
//               className="text-input"
//               value={title}
//               onChange={({ target }) => setTitle(target.value)}
//             />
//           </div>
//         </div>
//
//         <div className="field">
//           <div className="label">
//             <label>Logo</label>
//           </div>
//           <div className="form-element">
//             <FileInput
//               value={logo.file}
//               preview={logo.url}
//               onChange={setLogo}
//               loading={logoIsLoading}
//               disabled={logoIsLoading}
//               accept="image/png, image/jpeg"
//             />
//           </div>
//         </div>
//
//         <div className="field">
//           <div className="label" />
//           <div className="form-element d-flex justify-content-end">
//             <Button className="organization-form_submit-button" color="primary" disabled={logoIsLoading}>
//               {submitText}
//               {/*{create ? "Save new organization" : "Save"}*/}
//             </Button>
//           </div>
//         </div>
//       </Col>
//     </Row>
//   );
// };
