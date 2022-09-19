import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import "../../node_modules/draft-js/dist/Draft.css"
import { useParams } from "react-router-dom";
import "../styles/Entry.css"
import TextField from "@material-ui/core/TextField";
import { responsiveFontSizes } from '@material-ui/core';

const api_url = "http://localhost:5000/api/"

function EntryPage(props: {newEntry: boolean}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [editorFocus, setEditorFocus] = useState(false);
  const textEditorRef = useRef<Editor>(null);

  useEffect(() => {
    textEditorRef.current?.focus();
    if(!newEntry){
      loadEditorState();
    }
  }, []);


  const errorMessage = (errorMessage: string) => {
    return (
      <>
        <h1>OwO</h1>
        <p>We have an ewwow ^^:</p>
        <p>{ errorMessage }</p>
        <p>pwease infowm Ahmad at</p>
        <p>bakiahmad26@gmail.com</p>
      </>
    );
  }


  const idString = useParams()["id"];
  if(idString == undefined){
    return errorMessage("No id found");
  }
  let id: number = parseInt(idString);
  let newEntry: boolean = props.newEntry;


  const loadEditorState = async () => {
    const raw_response = await fetch(`${api_url}${id}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const json_response = await raw_response.json();
    if(!("content" in json_response)){
      return;
    }
    try {
      const json_content = JSON.parse(json_response["content"]);
      const current_content = convertFromRaw(json_content);
      setEditorState(EditorState.createWithContent(current_content));
      setTitle(json_response["title"]);
    } catch (error) {
      return;
    }
  };

  const saveEditorState = async () => {
    // localStorage.setItem(editorStateStorageKey, );
    const currentContent = editorState.getCurrentContent();
    const raw = convertToRaw(currentContent);
    const contentString = JSON.stringify(raw);
    const url = (newEntry) ? api_url : `${api_url}${id}`;
    const raw_response = await fetch(url,
      {
        method: (newEntry) ? 'POST' : "PATCH",
        body: JSON.stringify({
          id: id,
          title: title,
          content: contentString
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    const jsonResponse = await raw_response.json();
    
    // checks wether request failed ----------->
    if(!("status" in jsonResponse || jsonResponse["status"] != "ok")){
      // failed
      return;
    }

    newEntry = false;

    // becouse server says so
    if ("id" in jsonResponse) {
      id = jsonResponse["id"];
    }
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  }

  const Buttons = (props: { className: string, inlineStyles: string[], }) => {
    return (
      <div className={props.className}>
        {
          props.inlineStyles.map((style: string, i: number) => {
            return (
              <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle(style); }} key={i}>
                {style[0]}
              </button>
            );
          })
        }
      </div>
    );
  };  
  


  const inlineStyles = ["BOLD", "ITALIC", "UNDERLINE", "CODE", "STRIKETHROUGH"]
  return (
    <div>
      <div className="editorWrapper">
        <div className="titleText">
          <input placeholder="Title" type="text" value={title} onChange={(evt) => setTitle(evt.target.value)} />
        </div>
        <div className='saveButton'>
          <button onClick={saveEditorState}>
            <p>Save</p>
          </button>
        </div>

        {/* <Buttons className="buttons" inlineStyles={inlineStyles}/> */}
        <div className={`editor ${(editorFocus) ? "editorFocus" : ""}`}>
          <Editor ref={textEditorRef} editorState={editorState} handleKeyCommand={handleKeyCommand} 
          onChange={setEditorState} onFocus={() => setEditorFocus(true)} onBlur={() => setEditorFocus(false)}/>
        </div>
      </div>
    </div>
  );
}

export default EntryPage;