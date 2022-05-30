import React, { useEffect, useState } from "react";

import classNames from "classnames";

import { Col, Button, Spinner } from "reactstrap";

import { Search } from "@material-ui/icons";
import { Scrollbars } from "react-custom-scrollbars";

import FolderCreateModal from "./Components/FolderCreateModal";
import QuestionCreateModal from "./Components/QuestionCreateModal";
import Question from "features/Surveys/Components/Question";
import LoadingButton from "components/LoadingButton";

import "./styles.scss";
import { HEADER_HEIGHT } from "constants/header";

const FolderTemplate = ({ folderData, isSelected, onClick }) => {
  return (
    <div className="question-designer_folders_folder" onClick={onClick}>
      <div className={classNames("question-designer_folders_folder_state", { selected: isSelected })} />

      <div className="question-designer_folders_folder_description">
        <div className="question-designer_folders_folder_description_name">{folderData.name}</div>
        <div className="question-designer_folders_folder_description_questions-count">
          {`${folderData.questions.length} question${folderData.questions.length === 1 ? "" : "s"}`}
        </div>
      </div>
    </div>
  );
};

const QuestionDesignerComponent = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  isFoldersLoading,
  onQuestionSelect,
  selectedQuestionId,
  questionsInSurvey = [],
  onFolderDelete,
  isFolderDeleteProceed,
  onSearchValueChange,
  searchValue,
}) => {
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const [isCreateQuestionModalVisible, setIsCreateQuestionModalVisible] = useState(false);

  const [questionForEdit, setQuestionForEdit] = useState(null);

  const selectedFolder = folders?.filter((folder) => folder.id === selectedFolderId)[0] || [];

  const handleFolderDelete = () => {
    onFolderDelete(selectedFolderId);
  };

  const handleFolderSelect = (folderId) => {
    onFolderSelect(folderId);
  };

  const handleQuestionEdit = (questionId) => {
    setQuestionForEdit(
      selectedFolder.questions.filter((question) => question.latest_version.question_id === questionId)[0]
    );
    setIsCreateQuestionModalVisible(true);
  };

  const handleQuestionCreateModalClose = () => {
    setIsCreateQuestionModalVisible(false);

    if (questionForEdit) {
      setQuestionForEdit(null);
    }
  };

  const handleQuestionSelect = (questionData) => {
    onQuestionSelect(questionData);
  };

  const renderQuestionsInFolder = () => {
    const questions = [...selectedFolder.questions].reverse();

    const isQuestionBodyMatchSearchQuery = (question) => {
      if (!searchValue) return true;

      return !!~question.latest_version.question.body.toLowerCase().search(searchValue.toLowerCase());
    };

    const questionsThatMatchSearch = questions.filter((question) => isQuestionBodyMatchSearchQuery(question));

    if (!questionsThatMatchSearch.length) {
      return (
        <div className="question-designer_folder-questions_no-questions">
          There are no questions for that search query
        </div>
      );
    }

    // We separate question filtering and render because we want to leave correct question numbers that
    // depends on question index
    return questions.map((question, index) => {
      if (!isQuestionBodyMatchSearchQuery(question)) return null;

      return (
        <Question
          key={index}
          question={question}
          displayType="designer-view"
          questionNumber={selectedFolder.questions.length - index}
          onEdit={handleQuestionEdit}
          onClick={handleQuestionSelect}
          isInSurvey={~questionsInSurvey.findIndex((questionId) => question.latest_version.question_id === questionId)}
          isSelected={question.latest_version.question_id === selectedQuestionId}
        />
      );
    });
  };

  useEffect(() => {
    if (folders && folders[0] && selectedFolderId === -1) {
      onFolderSelect(folders[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  return (
    <>
      <Col xs={6} className="question-designer">
        <div className="question-designer_header">
          <div className="question-designer_header_title">Question designer</div>
          <div className="question-designer_header_search">
            <input type="text" onChange={onSearchValueChange} value={searchValue} />
            <Search style={{ color: "#95989A", fontSize: "28px" }} />
          </div>
        </div>
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - HEADER_HEIGHT}>
          <div className={"survey-folder-scroll"}>
            <div className="question-designer_folders">
              <Scrollbars
                className={"folder-scrollbar"}
                style={{ height: 170 }}
                renderScrollbarHorizontal={(props) => <div {...props} className="scrollbar-horizontal" />}
              >
                {!isFoldersLoading ? (
                  folders &&
                  folders.map((folder, index) => (
                    <FolderTemplate
                      key={index}
                      onClick={() => handleFolderSelect(folder.id)}
                      folderData={folder}
                      isSelected={folder.id === selectedFolder.id}
                    />
                  ))
                ) : (
                  <div className="question-designer_folders_loader">
                    <Spinner color="primary" size={40} />
                  </div>
                )}
                <button
                  className="question-designer_folders_add-folder"
                  onClick={() => setIsCreateFolderModalVisible(true)}
                >
                  +
                </button>
                {folders && !folders.length && (
                  <div className="question-designer_folders_folders-missing">
                    Create a folder to start creating questions
                  </div>
                )}
              </Scrollbars>
            </div>
            {selectedFolderId !== -1 && (
              <>
                <div className="question-designer_actions">
                  <LoadingButton
                    className="question-designer_actions_delete-btn"
                    color="secondary"
                    onClick={handleFolderDelete}
                    value="Delete folder"
                    isLoading={isFolderDeleteProceed}
                  />
                  <Button onClick={() => setIsCreateQuestionModalVisible(true)} color="primary">
                    Design new question
                  </Button>
                </div>
                <div className="question-designer_folder-questions">
                  {!selectedFolder?.questions?.length ? (
                    <div className="question-designer_folder-questions_no-questions">
                      There are no questions inside this folder,
                      <br />
                      click "Design new question" button to create a new question
                    </div>
                  ) : (
                    renderQuestionsInFolder()
                  )}
                </div>
              </>
            )}
          </div>
        </Scrollbars>
      </Col>

      <FolderCreateModal
        isOpen={isCreateFolderModalVisible}
        onClose={() => setIsCreateFolderModalVisible(false)}
        title={"New folder"}
      />

      {selectedFolderId !== -1 && (
        <QuestionCreateModal
          isOpen={isCreateQuestionModalVisible}
          onClose={handleQuestionCreateModalClose}
          title={"New question"}
          selectedFolder={selectedFolder}
          folders={folders}
          isEdit={!!questionForEdit}
          editQuestion={questionForEdit}
        />
      )}
    </>
  );
};

export default QuestionDesignerComponent;
