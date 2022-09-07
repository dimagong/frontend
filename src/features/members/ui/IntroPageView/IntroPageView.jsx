import "./styles.scss";

import React from "react";

import { Row, Col, Layout } from "antd";
import NpmCard from "../../../nmp-ui/NpmCard";
import NpmButton from "./../../../nmp-ui/NpmButton";
import { DownloadOutlined } from "@ant-design/icons";
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
                    <div className="intropage-block_content_navigations_btn-left">
                      <a
                        href={brochureUrl}
                        download={brochureName}
                        className={"intropage-block_content_navigations_btn-left_download"}
                      >
                        {downloadText}
                        <i>
                          <DownloadOutlined style={{ color: "#22776D", fontSize: "20px" }} />
                        </i>
                      </a>
                    </div>

                    {isOnboardingExist && (
                      <NpmButton
                        className="intropage-block_content_navigations_btn-right"
                        style={{ backgroundColor: "#22776D", borderColor: "#22776D", padding: "0% 35px" }}
                        onClick={() => redirectToOnboarding()}
                      >
                        Let's get started <i className="arrow right"></i>
                      </NpmButton>
                    )}
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
