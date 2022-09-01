import "./wysiwygEditor.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import classnames from "classnames";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import React, { useState, useEffect } from "react";
import { ContentState, EditorState, convertToRaw } from "draft-js";

export default function WysiwygEditor({
  toolbar,
  orgId = "default",
  disabled,
  data,
  onChange,
  orgPage = false,
  wrapperClassName,
}) {
  const [editorState, setEditorState] = useState(false);

  const init = () => {
    const blocksFromHTML = htmlToDraft(data || "<div></div>");
    let initValue = EditorState.createEmpty();
    if (blocksFromHTML) {
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      initValue = EditorState.createWithContent(contentState);
      setEditorState(initValue);
    }
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    if (!orgPage) {
      onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
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
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  if (!orgId || !editorState) return null;

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
