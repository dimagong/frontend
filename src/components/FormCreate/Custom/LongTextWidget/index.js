import React, {useEffect, useState} from 'react';

import FieldLabel from '../FieldLabel'

import './styles.scss'
import SurveyModal from "../../../../features/Surveys/Components/SurveyModal";
import WysiwygEditor from "../WysiwygEditor";

const LongTextWidget = ({props}) => {
  const {
    value,
    onChange,
    label,
    required
  } = props
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputHTML, setInputHTML] = useState('');
  const inputRef = React.useRef();

  const wysiwygChange = (event) => {
    setInputValue(event)
  }

  const handleModalClose = () => {
    setIsModalOpened(false);
    setInputHTML(inputValue)
    onChange(inputValue);
  }

  useEffect(() => {
    if (!inputValue) {
      setInputHTML(value)
      setInputValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className={'long-text-area-container'}>
      <FieldLabel label={label} required={required}/>
      <div className="custom-form-filed form-create_custom-text-widget custom-long-text-area-widget">
        <div className={'textarea custom-longtext'}
          ref={inputRef}
          contentEditable
          dangerouslySetInnerHTML={{__html: inputHTML}}
          placeholder={"Enter your answer here"}
          onInput={() => {
            let obj = inputRef.current;
            onChange(obj.innerHTML);
            setInputValue(obj.innerHTML);
          }}
        />
      </div>
      <span className={'long-text-area-open-more'} onClick={() => setIsModalOpened(true)}>Expand text area</span>

      <SurveyModal
        className={'long-text-modal-window'}
        isOpen={isModalOpened}
        onClose={handleModalClose}
        submitBtnText={"Close"}
        onSubmit={handleModalClose}
        title={"Extended input"}
      >

        <div className="custom-form-filed form-create_custom-text-widget custom-long-text-area-widget modal-long-text-area-widget">
          <h2 className={'modal-label'}>{label} {!!required && <span className="field-label_asterix">*</span>}</h2>
          <WysiwygEditor
            type={'text'}
            data={inputValue}
            onChange={event => wysiwygChange(event)}
            className="form-control"
            toolbar={{
              options: ['inline', 'list', 'textAlign', 'link'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline'],
              },
              textAlign: {
                inDropdown: false,
                options: ['indent', 'outdent'],
              }
            }}
          />

        </div>

      </SurveyModal>
    </div>
  )
}

export default LongTextWidget;
