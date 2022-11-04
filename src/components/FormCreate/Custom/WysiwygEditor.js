import "./wysiwygEditor.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import classnames from "classnames";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import React, { useRef, useState, useEffect } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";

const toEditorState = (stringHTML) => {
  const blocksFromHTML = htmlToDraft(stringHTML || "<div></div>");

  if (blocksFromHTML) {
    const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  }

  return EditorState.createEmpty();
};

export default function WysiwygEditor({ data, toolbar, disabled, onChange, wrapperClassName }) {
  const previousDataRef = useRef(data);
  const [editorState, setEditorState] = useState(() => toEditorState(data));

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  // Re-initiate state if data was nullable
  useEffect(() => {
    if (previousDataRef.current == null) {
      setEditorState(toEditorState(data));
    }
    previousDataRef.current = data;
  }, [data]);

  return (
    <Editor
      readOnly={disabled}
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName={classnames("wrapperClassName", wrapperClassName)}
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
      toolbar={toolbar}
    />
  );
}
