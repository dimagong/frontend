import "./styles.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import classnames from "classnames";
import React, { useState } from "react";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from "draft-js";

type Props = {
  data: any;
  orgId?: string;
  orgPage?: any;
  toolbar?: object;
  disabled?: boolean;
  wrapperClassName?: string;
  onChange?: (v: string) => void;
};

const NpmEditor: React.FC<Props> = (props) => {
  const { data, orgId = "default", orgPage = false, toolbar, disabled, wrapperClassName, onChange } = props;

  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = htmlToDraft(data || "<div></div>");
    let initValue = EditorState.createEmpty();

    if (blocksFromHTML) {
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      initValue = EditorState.createWithContent(contentState);
    }

    return initValue;
  });

  const onEditorStateChange = (editorState) => {
    if (!onChange) return;

    setEditorState(editorState);
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  if (!orgId || !editorState) return null;

  return (
    <Editor
      toolbar={toolbar}
      readOnly={disabled}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      editorClassName="editorClassName"
      toolbarClassName="toolbarClassName"
      wrapperClassName={classnames("wrapperClassName", wrapperClassName)}
    />
  );
};

export default NpmEditor;
