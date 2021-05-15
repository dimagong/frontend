import React, {useEffect, useState} from 'react';

import classNames from "classnames";

import {
  Col,
  Button,
  Spinner,
} from 'reactstrap';

import FolderCreateModal from "./Components/FolderCreateModal";
import QuestionCreateModal from "./Components/QuestionCreateModal";
import Question from "features/Surveys/Components/Question";

import './styles.scss'

const FolderTemplate = ({ folderData, isSelected, onClick }) => {

  return (
    <div className="question-designer_folders_folder" onClick={onClick}>
      <div className={classNames("question-designer_folders_folder_state", {selected: isSelected})} />

      <div className="question-designer_folders_folder_description">
        <div className="question-designer_folders_folder_description_name">
          {folderData.name}
        </div>
        <div className="question-designer_folders_folder_description_questions-count">
          {`${folderData.questions.length} question${folderData.questions.length === 1 ? "" : "s"}`}
        </div>
      </div>
    </div>
  )
};

const QuestionDesignerComponent = ({ folders, selectedFolderId, onFolderSelect, isFoldersLoading, onSetSelectedQuestion }) => {
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const [isCreateQuestionModalVisible, setIsCreateQuestionModalVisible] = useState(false);

  const [questionForEdit, setQuestionForEdit] = useState(null);

  const selectedFolder = folders?.filter((folder) => folder.id === selectedFolderId)[0] || [];

  const handleFolderSelect = (folderId) => {
    onFolderSelect(folderId)
  };

  const handleQuestionEdit = (questionId) => {
    setQuestionForEdit(selectedFolder.questions.filter((question) => question.latest_version.id === questionId)[0]);
    setIsCreateQuestionModalVisible(true)
  };

  const handleQuestionCreateModalClose = () => {
    if (questionForEdit) {
      setQuestionForEdit(null)
    }

    setIsCreateQuestionModalVisible(false)
  };

  const handleQuestionSelect = (questionData) => {
    console.log(questionData)
  };

  useEffect(() => {
    if(folders && folders[0] && selectedFolderId === -1) {
      onFolderSelect(folders[0].id)
    }
  }, [folders]);

  return (
    <>
      <Col xs={6} className="question-designer">
        <div className="question-designer_header">
          <div className="question-designer_header_title">
            Question designer
          </div>
          <div className="question-designer_header_search">

          </div>
        </div>
        <div className="question-designer_folders">
          {!isFoldersLoading ? folders.map((folder) => (
            <FolderTemplate
              onClick={() => handleFolderSelect(folder.id)}
              folderData={folder}
              isSelected={folder.id === selectedFolder.id}
            />
          )) : (
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
        </div>
        {selectedFolderId !== -1 && (
          <>
            <div className="question-designer_actions">
              <Button className="question-designer_actions_delete-btn" color="secondary">
                Delete folder
              </Button>
              <Button onClick={() => setIsCreateQuestionModalVisible(true)} color="primary">
                Design new question
              </Button>
            </div>
            <div className="question-designer_folder-questions">
              {!selectedFolder?.questions?.length ? (
                <div className="question-designer_folder-questions_no-questions">
                  There are no questions inside this folder,<br/>
                  click "Design new question" button to create a new question
                </div>
              ) : (
                selectedFolder.questions.map((question, index) => (
                  <Question
                    key={index}
                    question={question}
                    displayType="designer"
                    questionNumber={index + 1}
                    onEdit={handleQuestionEdit}
                    onClick={handleQuestionSelect}
                  />
                ))
              )}
            </div>
          </>
        )}
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
  )
};

export default QuestionDesignerComponent;
