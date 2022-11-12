// import "./styles.scss";
//
// import { Layout } from "antd";
// import type { FC } from "react";
// import React, { useState } from "react";
// // import { useQueryClient } from "react-query";
//
// import {
//   useMVADFormsQuery,
//   useSurveyPassingQuery,
//   useMVADFormsCategoriesQuery,
//   useProspectUserProfileQuery,
//   useNotifyIntroductionPageSeeingMutation,
//   MVAProfileQueryKeys,
// } from "api/Onboarding/prospectUserQuery";
//
// import { NpmSpin } from "features/nmp-ui";
// import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
//
// import { MemberMenu } from "../MemberMenu";
// import IntroPageView from "../IntroPageView";
// import { MemberHeader } from "../MemberHeader";
// import MemberDFormView from "../MemberDFormView";
// import { TypeConstants } from "../../data/constants/typeApplication";
// import MemberSurveyView from "../MemberSurveyView/MemberSurveyView";
//
// import { initialAppOnboarding } from "../../utils/findActiveAppOnboarding";
// import { collectApplicationsUser } from "../../utils/collectApplicationsUser";
//
// const useCallCollectQuery = () => {
//   const useDForms = useMVADFormsQuery();
//   const userSurveyPassing = useSurveyPassingQuery();
//   const userProspectProfile = useProspectUserProfileQuery();
//   const useDFormsCategories = useMVADFormsCategoriesQuery();
//   return { userProspectProfile, userSurveyPassing, useDForms, useDFormsCategories };
// };
//
// export const MemberPage: FC = () => {
//   /*const { userProspectProfile, userSurveyPassing, useDForms, useDFormsCategories } = useCallCollectQuery();
//   const queryClient = useQueryClient();
//
//   const dForms = useDForms.data;
//   const profile = userProspectProfile.data;
//   const onboardingSurveys = userSurveyPassing.data;
//   const dFormsCategories = useDFormsCategories.data;
//
//   const useRemoveUserNotify = useNotifyIntroductionPageSeeingMutation({
//     userId: profile?.id,
//     userNotifyEntryId: profile?.notify_entries[0]?.id,
//   });
//
//   const proceedUserToOnboarding = () => {
//     useRemoveUserNotify.mutate();
//     queryClient.invalidateQueries(MVAProfileQueryKeys.all());
//   };
//
//   const userApplications = collectApplicationsUser(dForms ?? [], onboardingSurveys ?? []);
//   const initialOnboarding = initialAppOnboarding(profile, userApplications);
//   const [activeOnboarding, setActiveOnboarding] = useState(() => initialOnboarding);
//
//   const brochureQuery = useOrganizationBrochureQuery(
//     { introPageId: profile?.notify_entries[0]?.notify?.id },
//     {
//       enabled: profile?.notify_entries.length === 1,
//     }
//   );
//
//   const onMenuChange = (onboarding) => setActiveOnboarding(onboarding);
//
//   if (
//     userSurveyPassing.isLoading ||
//     useDForms.isLoading ||
//     userProspectProfile.isLoading ||
//     useDFormsCategories.isLoading
//   ) {
//     return <NpmSpin size={60} />;
//   }
//
//   if (!activeOnboarding) {
//     return <NpmSpin size={60} />;
//   }*/
//
//   /*if (profile?.notify_entries.length > 0) {
//     return (
//       <IntroPageView
//         userName={profile?.first_name}
//         organizationName={profile?.permissions.organization}
//         redirectToOnboarding={proceedUserToOnboarding}
//         brochureUrl={brochureQuery.data.url}
//         brochureName={brochureQuery.data.file?.name}
//         isOnboardingExist={!!userApplications.length}
//         downloadText={profile?.notify_entries[0].notify.download_text}
//         introText={profile?.notify_entries[0].notify.intro_text}
//         introTitle={profile?.notify_entries[0].notify.intro_title}
//       />
//     );
//   }*/
//
//   // const organization = profile?.permissions?.organization ?? "Surveys organization";
//
//   return (
//     <Layout>
//       <Layout.Header>
//         <MemberHeader logoSrc="" avatarSrc="" organizationName={"Org name"} userName={"Han"} onLogoutClick={() => {}}>
//           {/*<MemberMenu
//             dforms={dForms}
//             dFormsCategories={dFormsCategories}
//             surveys={onboardingSurveys}
//             onboardings={userApplications}
//             activeOnboarding={activeOnboarding}
//             onMenuChange={onMenuChange}
//           />*/}
//         </MemberHeader>
//       </Layout.Header>
//
//       <Layout.Content>
//         Content
//         {/*{activeOnboarding.type === TypeConstants.SURVEY && (
//           <MemberSurveyView selectedSurveyId={activeOnboarding.id} organization={organization} />
//         )}
//         {activeOnboarding.type === TypeConstants.DFORM && (
//           <MemberDFormView
//             dformId={activeOnboarding.id}
//             status={activeOnboarding.status}
//             organization={profile.permissions.organization}
//             userFirstName={profile.first_name}
//           />
//         )}*/}
//       </Layout.Content>
//     </Layout>
//   );
// };
