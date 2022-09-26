import "./styles.scss";

import React from "react";

import { Layout } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { NpmCard, NpmButton } from "features/nmp-ui";

import memberviewIntro from "../../../../assets/img/pages/memberview-intro.png";

const { Header, Footer, Sider, Content } = Layout;

const IntroPageView = ({
  userName = "John",
  organizationName = "ValidPath",
  redirectToOnboarding,
  brochureUrl,
  brochureName,
  isOnboardingExist,
  downloadText,
  introText,
  introTitle = "Title",
}) => {
  return (
    <>
      <Layout className="intropage">
        <Content style={{ backgroundColor: "#F8F8F8" }}>
          <div className="intropage-component">
            <NpmCard>
              <div className="intropage-block">
                <div className="intropage-block_content">
                  <div className="intropage-block_content_title">{introTitle}</div>
                  <div className="intropage-block_content_greetings">Hi {userName},</div>
                  <div className="intropage-block_content_text" dangerouslySetInnerHTML={{ __html: introText }} />

                  <div className="intropage-block_content_navigations">
                    <NpmButton
                      type="nmp-ghost"
                      href={brochureUrl}
                      download={brochureName}
                      icon={<DownloadOutlined style={{ color: "#22776D", fontSize: "20px" }} />}
                      iconRight
                      style={{ minWidth: 170 }}
                    >
                      {downloadText}
                    </NpmButton>

                    {isOnboardingExist ? (
                      <NpmButton type="nmp-primary" style={{ minWidth: 170 }} onClick={redirectToOnboarding}>
                        Let's get started <i className="arrow right"></i>
                      </NpmButton>
                    ) : null}
                  </div>
                </div>
                <div className="intropage-block_img">
                  <img src={memberviewIntro} alt="memberview-intro" />
                </div>
              </div>
            </NpmCard>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default IntroPageView;