import "./styles.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import type { FC } from "react";
import classnames from "classnames";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import React, { useRef, useState, useEffect } from "react";
import { convertToRaw, EditorState, ContentState } from "draft-js";

const convertFromHTML = (HTMLString: string = ""): EditorState => {
  const blocksFromHTML = htmlToDraft(HTMLString);
  const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

  return EditorState.createWithContent(state);
};

const convertFromEditorState = (editorState?: EditorState): string => {
  if (!editorState) {
    return "";
  }

  const contentState = editorState.getCurrentContent();
  const rawDraftContentState = convertToRaw(contentState);
  return draftToHtml(rawDraftContentState) as string;
};

export type NmpWysiwygEditorProps = {
  value?: string;
  toolbar?: object;
  isDisabled?: boolean;
  wrapperClassName?: string;
  onChange?: (value: string, editorState: EditorState) => void;
};

export const NmpWysiwygEditor: FC<NmpWysiwygEditorProps> = (props) => {
  const { value, toolbar, isDisabled, wrapperClassName, onChange } = props;

  const previousValueRef = useRef(value);
  const [editorState, setEditorState] = useState<EditorState>(() => convertFromHTML(value));

  const onEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);

    if (onChange) {
      onChange(convertFromEditorState(editorState), editorState);
    }
  };

  // Re-initiate state if value was nullable
  useEffect(() => {
    if (previousValueRef.current == null) {
      setEditorState(convertFromHTML(value));
    }
    previousValueRef.current = value;
  }, [value]);

  return (
    <Editor
      toolbar={toolbar}
      readOnly={isDisabled}
      editorState={editorState}
      onEditorStateChange={onEditorChange}
      editorClassName="nmp-wysiwyg__editor"
      toolbarClassName="nmp-wysiwyg__toolbar"
      wrapperClassName={classnames("nmp-wysiwyg__wrapper", wrapperClassName)}
    />
  );
};
