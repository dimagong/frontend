import React, {useState, useMemo, useEffect} from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'
import { CheckCircleOutline, HighlightOff } from '@material-ui/icons'
import { getTimeDifference } from "utility/common";
import { QueryBuilder, SmsOutlined } from "@material-ui/icons";

import SurveyFeedbackModal from "./Components/SurveyFeedbackModal";

import _ from 'lodash'

const MultipleChoice = ({ options, correctAnswerId, answer, points }) => {

  const selectedAnswer = options.filter(option => option.id === answer.answer)[0];

  return (
    <div className={"answer multiple-choice"}>
      <div className="options">
        <div className={`option selected`}>
          <div className={"option-circle"} />
          <div className={"option-text"}>
            {selectedAnswer.text}
          </div>
        </div>
        <div className="answer-correctness">
          {selectedAnswer.id === correctAnswerId ? (
            <div className="correct-answer">
              <CheckCircleOutline style={{fontSize: "30px", color: "#00BF00"}} />
              <span className="correct-answer_label">+ {points} points</span>
            </div>
          ) : (
            <div className="wrong-answer">
              <HighlightOff style={{fontSize: "30px", color: "#D42D2D"}} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

const FreeText = ({ answer, maxPoints, gradingPoints, onGradingPointsChange, reviewerNotes, onReviewerNotesChange, isGradingReview }) => {

  return (
    <div className="answer free-text">
      <div>
        <TextArea
          value={answer.answer}
          onChange={() => {}}
          height={7}
          disabled
        />
      </div>
      <div className="answer-review">
        <div className="score">
          Score:
          <input disabled={isGradingReview}
                 className="score_input"
                 type="text"
                 value={gradingPoints === null ? "" : gradingPoints}
                 onChange={isGradingReview ? () => {} : onGradingPointsChange}/>
          / {maxPoints}
        </div>
        <div className="answer-review_notes">
          <div className="answer-review_notes_label">
            Reviewer notes
          </div>
          <TextArea
            value={reviewerNotes}
            onChange={isGradingReview ? () => {} : onReviewerNotesChange}
            height={7}
            disabled={isGradingReview}
          />
          <div className="answer-review_notes_tip">
            These notes will only be visible to Managers of this organization
          </div>
        </div>

      </div>
    </div>
  )
};

const GradingQuestion = ({
  displayType,
  questionNumber,
  questionData,
  answer,
  onGradingAnswerSave,
  onFinishButtonDisableStateChange,
  isGradingReview,
  onFeedbackSubmit,
  isFeedbackSubmitProceeding,
}) => {

  const [gradingPoints, setGradingPoints] = useState(answer?.grade_structure?.grade);
  const [reviewerNotes, setReviewerNotes] = useState(answer?.grade_structure?.reviewer_notes || "");
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);

  const {
    body,
    answer_structure: {type, options, points, max_points}
  } = questionData;

  const handleAnswerGradingSave = (notes, grade) => {

    const gradingData = {
      answers_grading: [
        {
          "question_id": questionData.id,
          "grade": grade,
          "reviewer_notes": notes
        }
      ]
    };

    onFinishButtonDisableStateChange(false);
    onGradingAnswerSave(gradingData);
  };


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGradingSave = useMemo(() => _.debounce(handleAnswerGradingSave, 1000, {maxWait: 10000}), []);

  const handleGradingPointsChange = (e) => {
    if(/[^0-9]/g.test(e.target.value)) return;

    let points = Number(e.target.value);

    if (points > max_points) {
      points = max_points
    } else if (points < 0) {
      points = null;
    }

    onFinishButtonDisableStateChange(true);
    setGradingPoints(points);
    debouncedGradingSave(reviewerNotes, points);
  };

  const handleReviewerNotesChange = (e) => {
    onFinishButtonDisableStateChange(true);
    setReviewerNotes(e.target.value);
    debouncedGradingSave(e.target.value, gradingPoints);
  };

  useEffect(() => {

    if (answer.grade_structure) {
      setGradingPoints(answer?.grade_structure?.grade);
      setReviewerNotes(answer?.grade_structure?.reviewer_notes || "");

    } else {
      setGradingPoints(null);
      setReviewerNotes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData.id]);

  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>
        {`Question ${questionNumber}`}{" "}
        <SmsOutlined className="question-feedback_icon" onClick={() => setIsFeedbackModalVisible(true)} />
      </div>
      <div className="question-time">
        <QueryBuilder
          style={{
            fontSize: "18px",
            color: "#444",
            marginRight: "5px",
            paddingTop: "1px",
          }}
        />{" "}
        {getTimeDifference(answer.started_at, answer.finished_at)}
      </div>
      <div className={"question-description"}>{body}</div>

      {
        {
          multiple_choice: (
            <MultipleChoice
              answer={answer}
              options={options}
              correctAnswerId={questionData.correct_answer}
              points={points}
            />
          ),
          text: (
            <FreeText
              answer={answer}
              maxPoints={max_points}
              gradingPoints={gradingPoints}
              reviewerNotes={reviewerNotes}
              isGradingReview={isGradingReview}
              onGradingPointsChange={handleGradingPointsChange}
              onReviewerNotesChange={handleReviewerNotesChange}
            />
          ),
        }[type]
      }

      <SurveyFeedbackModal
        isSubmitProceed={isFeedbackSubmitProceeding}
        initFeedback={answer.feedback}
        isOpen={isFeedbackModalVisible}
        onSubmit={onFeedbackSubmit}
        questionId={questionData.id}
        onClose={() => setIsFeedbackModalVisible(false)}
      />
    </div>
  );
};


export default GradingQuestion;
