import React, { useState } from "react";

import ArrowButton from "components/ArrowButton";

import "./styles.scss";

const SurveyAdditionalInfoView = ({ label, text, className }) => {
  const [isTextVisible, setIsTextVisible] = useState(true);

  const handleToggle = () => {
    setIsTextVisible(!isTextVisible);
  };

  const combineLinksWithText = (textArray, linksArray) => {
    const LinkTemplate = ({ link }) => (
      <a
        target={"_blank"}
        rel="noopener noreferrer"
        className="survey_additional_info_component-content-link"
        href={link}
      >
        {link}
      </a>
    );

    return textArray.map((textFragment, index) => (
      <>
        {textFragment}
        {linksArray[index] && <LinkTemplate link={linksArray[index]} />}
      </>
    ));
  };

  const handleAllLinksInText = (text) => {
    const LINKS_REGEX = /\w+:\/\/.*?(?=\s)/g;

    // Bug in regex. It won't see link that is at the end of text in case if there is no symbol after it
    const formattedText = text + " ";

    const splittedText = formattedText.split(LINKS_REGEX);
    const linksFormText = [...formattedText.matchAll(LINKS_REGEX)];

    return combineLinksWithText(splittedText, linksFormText);
  };

  return (
    <div className={`survey_additional_info_component ${className ? className : ""}`}>
      <div className="survey_additional_info_component-header">
        <div className="survey_additional_info_component-header-label">{label}</div>
        <ArrowButton onClick={handleToggle} direction={isTextVisible ? "up" : "down"} chevronSize={20} />
      </div>
      {isTextVisible && <div className="survey_additional_info_component-content">{handleAllLinksInText(text)}</div>}
    </div>
  );
};

export default SurveyAdditionalInfoView;
