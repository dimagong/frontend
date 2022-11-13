import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { DownloadOutlined } from "@ant-design/icons";

import { NmpCard, NmpButton, NmpRow, NmpCol, NmpArrowRightIcon } from "features/nmp-ui";
import { useOrganizationBrochureQuery } from "../../../../api/file/useOrganizationFileQueries";

type Props = {
  username?: string;
  introText?: string;
  introTitle?: string;
  brochureId?: number;
  brochureName?: string;
  downloadText?: string;
  isOnboardingExist?: boolean;
  onStartClick?: () => void;
};

export const MemberIntroductionTemplate: FC<Props> = (props) => {
  const {
    username = "{{username}}",
    introText = "{{intro-text}}",
    introTitle = "{{intro-title}}",
    brochureId,
    brochureName = "{{brochure-name}}",
    downloadText = "{{download-text}}",
    isOnboardingExist = false,
    onStartClick,
  } = props;

  const brochureQuery = useOrganizationBrochureQuery({ introPageId: brochureId }, { enabled: Boolean(brochureId) });

  return (
    <div className="member-introduction">
      <NmpCard>
        <div className="member-introduction__body">
          <div className="member-introduction__content">
            <h1 className="member-introduction__title">{introTitle}</h1>

            <h2 className="member-introduction__greetings">Hi {username},</h2>

            <div className="member-introduction__text-scrollable">
              <div className="member-introduction__text" dangerouslySetInnerHTML={{ __html: introText }} />
            </div>

            <NmpRow className="member-introduction__navigations" justify="space-between">
              <NmpCol span="16">
                <NmpButton
                  type="nmp-ghost"
                  href={brochureQuery.data.url}
                  download={brochureQuery.data.file?.name || brochureName}
                  icon={<DownloadOutlined style={{ color: "#22776D", fontSize: "20px" }} />}
                  iconRight
                  style={{ minWidth: 170 }}
                >
                  {downloadText}
                </NmpButton>
              </NmpCol>

              <NmpCol span="6">
                {isOnboardingExist ? (
                  <NmpButton
                    type="nmp-primary"
                    icon={<NmpArrowRightIcon style={{ fontSize: "11px" }} />}
                    iconRight
                    style={{ minWidth: 170 }}
                    onClick={onStartClick}
                  >
                    Let's get started
                  </NmpButton>
                ) : null}
              </NmpCol>
            </NmpRow>
          </div>
        </div>
      </NmpCard>
    </div>
  );
};
