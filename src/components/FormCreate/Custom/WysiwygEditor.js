import React, {useState, useEffect} from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'

import './wysiwygEditor.scss';

export default function WysiwygEditor({orgId = "default", disabled, data, onChange, orgPage = false}) {
  const [editorState, setEditorState] = useState(false);

  const init = () => {
    const blocksFromHTML = htmlToDraft(data ||'<div></div>');
    let initValue = EditorState.createEmpty();
    if (blocksFromHTML) {
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      initValue = EditorState.createWithContent(contentState)
      setEditorState(initValue)
    }
  }

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    if(!orgPage) {
      onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    } else {
      // If editor have only whitespaces etc. (empty)
      if (!!editorState.getCurrentContent().getPlainText().trim()) {
        onChange({
          rich: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          raw: editorState.getCurrentContent().getPlainText().trim(),
        });
      }
    }


  };

  useEffect(() => {
    init()
  }, [orgId])

  if(!orgId || !editorState) return null;

  return (
    <Editor
      readOnly={disabled}
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
    />)
}

