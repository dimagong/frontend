import "./styles.scss";

import { Form } from "antd";
import type { FC } from "react";
import React, { useState } from "react";

import { NmpCol, NmpRow, NmpCard, NmpButton } from "features/nmp-ui";

import { DFormContext } from "../DFormContext";
import { DformAccessTypes } from "../../types";
import { DFormMemberSection } from "./DFormMemberSection";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormSteps, DFormStepsProps } from "../DFormSteps";
import { DFormMemberCheckSave } from "../DFormMemberCheckSave";
import { DformBlockModel, DformGroupModel, DformId, DformSectionId, DformSectionModel } from "../../data/models";

const sectionsToSteps = (sections: DformSectionModel[]): DFormStepsProps["items"] => {
  return sections.map((section, index) => {
    if (index === 0) {
      return { title: section.name, status: "process", disabled: false };
    }
    return { title: section.name, status: "wait", disabled: true };
  });
};

export type DFormMemberFormProps = {
  blocks: DformBlockModel[];
  groups: DformGroupModel[];
  dformId: DformId;
  dformName: string;
  sections: DformSectionModel[];
  accessType: DformAccessTypes;
  relatedSectionsIds: DformSectionId[];
};

export const DFormMemberForm: FC<DFormMemberFormProps> = (props) => {
  const { blocks, groups, dformId, dformName, sections, accessType, relatedSectionsIds } = props;

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionSteps, setSectionSteps] = useState(() => sectionsToSteps(sections));

  const section = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length;
  const isFirstSection = currentSectionIndex === 0;

  const percent = 0;

  const onNextButtonClick = () => {
    const next = currentSectionIndex + 1;

    setCurrentSectionIndex((prev) => prev + 1);
    setSectionSteps((prev) =>
      prev?.map((item, index) => {
        if (currentSectionIndex === index) {
          return { ...item, status: "finish" };
        }
        if (next === index) {
          return { ...item, status: "process", disabled: false };
        }
        return item;
      })
    );
  };

  return (
    <>
      <NmpRow>
        <NmpCol xl={{ span: 12, push: 6 }} span={16} push={4}>
          <h2 className="dform-member-form__title">{dformName}</h2>
        </NmpCol>
      </NmpRow>

      <NmpRow>
        <NmpCol sm={4} className="dform-member-form__steps">
          <div className="dform-member-form__steps-scroll">
            <DFormSteps items={sectionSteps} current={currentSectionIndex} percent={percent} />
          </div>
        </NmpCol>

        <NmpCol xl={{ span: 12, push: 6 }} span={16} push={4}>
          <NmpCard className="dform-member-form__card">
            <DFormContext.Provider dformId={dformId} accessType={accessType} isMemberView>
              <DformSchemaContext.Provider
                blocks={blocks}
                groups={groups}
                sections={sections}
                relatedSectionsIds={relatedSectionsIds}
              >
                <DFormMemberSection sectionId={section.id} />
              </DformSchemaContext.Provider>
            </DFormContext.Provider>

            <NmpRow justify="space-between" align="middle" className="dform-member-form__actions">
              <NmpCol>
                <DFormMemberCheckSave isLoading={false} />
              </NmpCol>

              {/* ToDo: Implement Back button */}
              {/*{isFirstSection ? null : (
                    <NmpCol>
                      <NmpButton type="nmp-ghost">Back</NmpButton>
                    </NmpCol>
                  )}*/}

              <NmpCol>
                <NmpButton type="nmp-primary" onClick={onNextButtonClick}>
                  {isLastSection ? "Submit for review" : "Next Section"}
                </NmpButton>
              </NmpCol>
            </NmpRow>
          </NmpCard>
        </NmpCol>
      </NmpRow>
    </>
  );
};
