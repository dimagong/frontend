import React, {useState} from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'

export default function WysiwygEditor(props) {
  const blocksFromHTML = htmlToDraft(props.data ||'<div></div>');
  let initValue = EditorState.createEmpty();
  if (blocksFromHTML) {
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    initValue = EditorState.createWithContent(contentState)
  }
  const [editorState, setEditorState] = useState(initValue);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    props.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
    />)
}

