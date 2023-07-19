import React, { useState} from 'react';
import { PollDescription, PollName, UnixTimestamp, OptionName, PollInitObject } from '../types/commonTypes';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { MAX_DESC, MAX_OPTIONS, MAX_OPTION_NAME_LENGTH, MAX_TITLE } from '../variables';
import "react-datepicker/dist/react-datepicker.css";
import { createPoll } from '../utils/createPoll';


export default function NewPoll() {
  const now = new Date();
  let scrollStyle: React.CSSProperties = {}  
  //if (window.innerWidth < 760) {scrollStyle.overflowY =  "scroll"};
  const [title, setTitle] = useState<PollName>("");
  const [desc, setDesc] = useState<PollDescription>("");
  const [end, setEnd] = useState<Date>(now);
  const [options, setOptions] = useState<OptionName[]>(["", "", ""]);

  
  function createNewPoll() {
    const params: PollInitObject = {
      name: title,
      desc: desc,
      end: Math.floor(end.getTime()/1000),
      options: options
    }

    toast.promise(
      createPoll(params),
      {
        pending: 'Preparing transaction...',
        success: 'Creating the poll was successful!',
        error: 'The transaction failed. Please try again!'
      }
    )  

  }
  
  function changeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle: PollName = e.target.value;
    
    if (newTitle.length > MAX_TITLE) {
      console.error("The title is too long! Max length (bytes): ", MAX_TITLE);
      return;
    }
    
    setTitle(newTitle);
  }

  function changeDesc(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newDesc: PollDescription = e.target.value;
    
    if (newDesc.length > MAX_DESC) {
      console.error("The description is too long! Max length (bytes): ", MAX_DESC);
      return;
    }

    setDesc(newDesc);
  }
  
  function changeEndTime(newTime: Date) {
    setEnd(newTime);
  }

  function newOption() {
    if (options.length < MAX_OPTIONS) {
      setOptions(prevOptions => {
        const updatedOptions = [...prevOptions, ""];
        return updatedOptions;
      });
    }
  }

  function deleteOption(index: number) {
    setOptions(prevOptions => {
      const updatedOptions = [...prevOptions];
      updatedOptions.splice(index, 1);
      return updatedOptions;
    });
  }

  function setOption(index: number, newOption: OptionName) {
    if (newOption.length > MAX_OPTION_NAME_LENGTH) {
      console.error("Option name is too long! Max length (bytes): ", MAX_OPTION_NAME_LENGTH);
      return;
    }
    
    setOptions(prevOptions => {
      const updatedOptions = [...prevOptions];  
      updatedOptions[index] = newOption;
      return updatedOptions;
    });
  }

  return (
    <div id="newPoll" style={scrollStyle}>
      <div id="newPollContainer">
        <h1 id="newPollTitle">Create a New Poll</h1>
        
        <input 
          id="newPollName"
          type={"text"}
          placeholder={"Poll Title"}
          value={title} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeTitle(e)}
          maxLength={MAX_TITLE}
        />

        <textarea
          id="newPollDesc"
          placeholder={"Description"}
          value={desc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => changeDesc(e)}
          maxLength={MAX_DESC}
        />

        <label className="newPollLabel">Pick a time when the poll will expire:</label>
        <DatePicker
          id="newPollDatePicker"
          selected={end}
          onChange={(newTime: Date) => changeEndTime(newTime)}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm:ss"
          timeFormat="HH:mm:ss"
          timeIntervals={15}
          timeCaption="Time"
          placeholderText="Select Expiration Date and Time"
        />

          <div id="newPollAddNewBtnContainer">
            <div className="flexGrow"></div>
            {(options.length < MAX_OPTIONS) && (
              <button
                id="newPollAddNewOption"
                onClick={newOption}
              >
                {"+ Option"}
              </button>
              )}
          </div>

        <div id="newPollOptionsBox">

          {(options.length > 0) && (
            <ul id="newPollOptionsList">
              {options.map((option: OptionName, index: number) => (
                <li key={index} className="newPollOptionElement">
                  <input 
                    className="newPollOptionText"
                    placeholder={"Option " + (index+1)}
                    value={options[index]} 
                    type={"text"} 
                    onChange={(event) => setOption(index, event.target.value)}
                  />
                  <button
                    className="newPollOptionDelete"
                    onClick={() => deleteOption(index)}
                  >
                    {"X"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button id="newPollSend" onClick={createNewPoll}>{"Create Poll"}</button>
      </div>
    </div>
  )
}
