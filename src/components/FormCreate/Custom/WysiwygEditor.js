import React, {useState, useEffect} from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'

export default function WysiwygEditor(props) {
  const [editorState, setEditorState] = useState(false);

  const init = () => {
    const blocksFromHTML = htmlToDraft(props.data ||'<div></div>');
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
    props.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  useEffect(() => {
    init()
  }, [props.orgId])

  if(!props.orgId || !editorState) return null;

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
    />)
}

