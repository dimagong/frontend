import React, { useState, useEffect, useRef } from 'react';

import classNames from "classnames";

import SurveyModal from "features/Surveys/Components/SurveyModal";
import { Input, TextArea, Select, Checkbox } from "features/Surveys/Components/SurveyFormComponents";
import { Plus } from "react-feather";

import { useOutsideAlerter } from "hooks/useOutsideAlerter";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from '@material-ui/icons'

import { createLoadingSelector } from "app/selectors/loadingSelector";
import { usePrevious } from "hooks/common";
import { selectError } from "app/selectors";

import * as yup from 'yup';

import './styles.scss'

import appSlice from "app/slices/appSlice";

const {
  createQuestionRequest,
  updateQuestionRequest,
} = appSlice.actions;

const questionTypes = [
  {
    type: "multiple_choice",
    label: "Multiple choice",
  },
  {
    type: "text",
    label: "Free text",
  },
];

const QuestionTypeItem = ({ item, isSelected, onClick }) => {

  return (
    <div
      className={classNames("question-type", {selected: isSelected})}
      onClick={() => onClick(item)}
    >
      <div className="question-type_status" />
      <div className="question-type_label">
        {item.label}
      </div>
    </div>
  )
};

const AnswerOption = ({ optionData, onTextChange, onStatusChange, onOptionRemove }) => {

  const inputRef = useRef(null);
  const [isEditMode, setEditMode] = useState(false);

  const handleOptionEdit = () => {
    setEditMode(true);
  };

  const handleClickOutside = () => {
    setEditMode(false)
  };

  useOutsideAlerter([inputRef], handleClickOutside);

  useEffect(() => {
    if(isEditMode) {
      inputRef.current.focus()
    }
  }, [isEditMode]);

  return (
    <div className={classNames("multiple-choice-answers_answer", {selected: optionData.is_correct})}>
      <div className="multiple-choice-answers_answer_status" onClick={onStatusChange} />
      <div className="multiple-choice-answers_answer_input" onClick={handleOptionEdit}>
        {isEditMode ? (
          <input ref={inputRef} value={optionData.text} type="text" onChange={onTextChange} />
        ) : (
          optionData.text ? optionData.text : "Click to edit, click on circle to mark as correct answer"
        )}
      </div>
      <div className="multiple-choice-answers_answer_remove" onClick={onOptionRemove}>
        <Cancel style={{color: "#4b484d"}}/>
      </div>
    </div>
  )
};

const multipleChoiceValidationSchema = yup.object().shape({
  text: yup.string().trim().required("Please, provide text for each answer option"),
  is_correct: yup.bool(),
});

const questionValidationSchema = yup.object().shape({
  folder_id: yup.string().required("Select folder for this question"),
  question_version: yup.object().shape({
    question: yup.object().shape({
      body: yup.string().trim().required("Please, provide a question description"),
      points: yup.number().required("Please, provide a question weight"),
      hint: yup.string().trim().when('$isHintEnabled', {
        is: true,
        then: yup.string().required("Please, provide a hint message or uncheck hint checkbox")
      }),
      answer_structure: yup.object().shape({
        type: yup.string()
                  .oneOf(["text", "multiple_choice"])
                  .required("If you see this error, please contact one of admins, question type is not provided"),
        options: yup.array().when("type", {
          is: "multiple_choice",
          then: yup.array().of(multipleChoiceValidationSchema)
                           .test('minimum-one-option', 'Please, add at least one answer option', options => {
                             return options.length >= 1
                           })
                           .test(
                             'minimum-one-correct-answer',
                             'Please, mark one answer as correct, by clicking a circle in answer option',
                             options => {
                               return options.some(option => option.is_correct)
                             },
                           ),
        })
      })

    })
  })
});


const QuestionCreateModal = ({ isOpen, onClose, selectedFolder, folders, isEdit, editQuestion }) => {

  const dispatch = useDispatch();

  const [questionType, setQuestionType] = useState(questionTypes[0]);
  const [questionFolder, setQuestionFolder] = useState({label: selectedFolder.name, value: selectedFolder});
  const [isHintEnabled, setIsHintEnabled] = useState(true);
  const [hint, setHint] = useState('');
  const [questionBody, setQuestionBody] = useState('');
  const [markingNotes, setMarkingNotes] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [questionWeight, setQuestionWeight] = useState("10");


  const isQuestionCreateLoading = useSelector(createLoadingSelector([createQuestionRequest.type], true));
  const isQuestionUpdateLoading = useSelector(createLoadingSelector([updateQuestionRequest.type], true));
  const error = useSelector(selectError);

  const prevCreationLoadingValue = usePrevious(isQuestionCreateLoading);
  const prevUpdateLoadingValue = usePrevious(isQuestionUpdateLoading);

  const handleAnswerTypeChange = (type) => {
    setQuestionType(type)
  };

  const handleOptionTextChange = (optionIndex) => {
    return (e) => setAnswerOptions(answerOptions.map((option, key) => {
      if (key === optionIndex) {
        return {...option, text: e.target.value}
      } else {
        return option;
      }
    }))
  };

  const handleOptionStatusChange = (optionIndex) => {
    return () => setAnswerOptions(answerOptions.map((option, key) => {
      if (key === optionIndex) {
        return {...option, is_correct: !option.is_correct}
      } else {
        return {...option, is_correct: false}
      }
    }))
  };

  const handleOptionAdd = () => {
    if(answerOptions.length < 10) {
      setAnswerOptions([
        ...answerOptions,
        {text: "", is_correct: false}
      ])
    } else {
      toast.error("You cannot add more then 10 answers")
    }
  };

  const handleOptionDelete = (optionIndex) => (() => (
      setAnswerOptions(answerOptions.filter((option, key) => key !== optionIndex))
  ));

  const handleQuestionWeightChange = (e) => {
    if(/[^0-9]/g.test(e.target.value)) return;

    let value = e.target.value.toString();

    // Value in range 0-99
    if (value[0] === "0" && value.length > 1) {
      value = value.substring(1)
    } else if (value.length > 2) {
      value = "99"
    } else if (value.length === 0) {
      value = "0"
    }

    setQuestionWeight(value);
  };

  const handleFolderSelect = (value) => {
    setQuestionFolder(value)
  };

  const handleModalClose = () => {
    if (!isQuestionCreateLoading && !isQuestionUpdateLoading) {
      onClose();

      setQuestionType(questionTypes[0]);
      setIsHintEnabled(true);
      setHint("");
      setQuestionBody("");
      setMarkingNotes("");
      setAnswerOptions([]);
      setQuestionWeight("10");
    }
  };

  const handleSubmit = async () => {

    let answerStructure;

    switch (questionType.type) {
      case "text": answerStructure = {type: "text"}; break;
      case "multiple_choice": {answerStructure = {type: "multiple_choice", options: answerOptions}; break;}
      default: console.error("Selected question type doesn't exist", questionType.type)
    }

    const questionData = {
      question_version: {
        question: {
          body: questionBody,
          points: Number(questionWeight),
          hint: isHintEnabled ? hint : "",
          marking_notes: markingNotes,
          answer_structure: answerStructure,
        },
      },
      folder_id: Number(questionFolder.value.id),
    };

    const isValid = await questionValidationSchema
      .validate(questionData, {context: {isHintEnabled}})
      .catch((err) => { toast.error(err.message) });

    if (!isValid) return;


    if (isEdit) {
      questionData.question_version.question_id = editQuestion.latest_version.id;
      dispatch(updateQuestionRequest({data: questionData, questionId: editQuestion.id}))
    } else {
      dispatch(createQuestionRequest(questionData))
    }

  };

  useEffect(() => {
    setQuestionFolder({label: selectedFolder.name, value: selectedFolder})
  }, [selectedFolder]);

  useEffect(() => {
    if (!error && prevCreationLoadingValue === true && !isQuestionCreateLoading) {
      handleModalClose()
    }
  }, [isQuestionCreateLoading]);

  useEffect(() => {
    if (!error && prevUpdateLoadingValue === true && !isQuestionUpdateLoading) {
      handleModalClose()
    }

  }, [isQuestionUpdateLoading]);



  useEffect(() => {
    if (isEdit) {

      const {
        question: {
          body,
          hint,
          points,
          marking_notes,
          answer_structure: {
            type,
            options
          }
        }
      } = editQuestion.latest_version;

      const questionType = questionTypes.filter((item) => item.type === type)[0];

      setQuestionType(questionType);
      setIsHintEnabled(!!hint);
      setHint(hint || "");
      setQuestionBody(body);
      setMarkingNotes(marking_notes);
      setAnswerOptions(type === "multiple_choice" ? options : []);
      setQuestionWeight(String(points));
    }
  }, [isEdit]);

  return (
    <SurveyModal
      className="question-create-modal"
      title={"New question"}
      isOpen={isOpen}
      onClose={handleModalClose}
      submitBtnText={isEdit ? "Save" : "Create"}
      onSubmit={handleSubmit}
      isSubmitProceed={isEdit ? isQuestionUpdateLoading : isQuestionCreateLoading}
    >
      <div className="question-form">
        <div className="question-form_header">
          <div className="question-form_header_title">
            {`Question ${questionFolder.value.questions.length + 1}`}
          </div>
          <div className="question-form_header_folder-select">
            <Select
              value={questionFolder}
              onChange={handleFolderSelect}
              options={folders.map((folder) => ({value: folder, label: folder.name}))}
            />
          </div>
        </div>
        <div className="question-form_description">
          <TextArea
            name="question-description"
            onChange={(e) => {setQuestionBody(e.target.value)}}
            value={questionBody}
            height={7}
          />
        </div>
        <div className="question-form_question-types">
          {questionTypes.map((item) => (
            <QuestionTypeItem
              key={item.label}
              item={item}
              onClick={handleAnswerTypeChange}
              isSelected={item.type === questionType.type}
            />
          ))}
        </div>
        <div className="question-form_question-answers">
          {questionType.type === "multiple_choice" && (
            <div className="multiple-choice-answers">
              <div className="multiple-choice-answers_title">
                Multiple choice answers
              </div>

              {answerOptions.map((option, index) => (
                <AnswerOption
                  key={index}
                  optionData={option}
                  onTextChange={handleOptionTextChange(index)}
                  onStatusChange={handleOptionStatusChange(index)}
                  onOptionRemove={handleOptionDelete(index)}
                />
              ))}

              <div className="multiple-choice-answers_add-answer" onClick={handleOptionAdd}>
                <Plus />
              </div>
            </div>
          )}
        </div>
        <div className="question-form_question-hint">
          <Checkbox
            checked={isHintEnabled}
            onChange={() => setIsHintEnabled(!isHintEnabled)}
            className="question-form_question-hint_checkbox"
            name="hint"
            label="Hint"
          />
          <TextArea
            disabled={!isHintEnabled}
            name="hint"
            height={3}
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />
        </div>
        <div className="question-form_marking-notes">
          <label htmlFor="marking-notes">Marking notes</label>
          <TextArea
            name="marking-notes"
            height={5}
            value={markingNotes}
            onChange={(e) => setMarkingNotes(e.target.value)}
          />
        </div>
        <div className="question-form_question-weight">
          <span className="mr-3">
            Default weighting
          </span>
          <Input
            placeholder={" "}
            className="weight-input"
            onChange={handleQuestionWeightChange}
            value={questionWeight}
          />
        </div>
      </div>
    </SurveyModal>
  )
};

export default QuestionCreateModal;
