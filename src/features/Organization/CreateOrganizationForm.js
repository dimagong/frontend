// import * as yup from "yup";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
//
// import { OrganizationForm } from "./OrganizationForm";
//
// const organizationValidation = yup.object().shape({
//   type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
//   name: yup.string().required("Name is required"),
//   logo: yup.object().shape({
//     url: yup.string().nullable().required("Logo is required"),
//     file: yup.mixed().nullable().required("Logo is required"),
//   }),
// });
//
// export const CreateOrganizationForm = () => {
//   const dispatch = useDispatch();
//
//   const [newOrganization] = useState({ title: "", });
//   // const [organization, setOrganization] = useState(
//   //   create ? ORGANIZATION_TEMPLATE : getOrganizationData(organization)
//   // );
//
//   const recoverRemovedFilesData = () => {
//     if (organizationData.logo.file === null) {
//       setLogoField(logoQuery.data.file);
//     }
//
//     if (organizationData.brochure.file === null) {
//       setBrochureField(brochureQuery.data.file);
//     }
//   };
//
//   const onSubmit = async () => {
//     const isValid = await organizationValidation.validate(organizationData).catch((err) => {
//       toast.error(err.message);
//     });
//
//     if (!isValid) {
//       // If some files was removed than recover them for better UX when form validation fails
//       recoverRemovedFilesData();
//       return;
//     }
//   };
//
//   return <OrganizationForm title="" onSubmit={onSubmit} submitText="Save new organization" />;
// };
