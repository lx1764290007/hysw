import React from "react";
import "./toast.css";
export const Toast = ({content})=>{

  return (
    <React.Fragment >
      <div className = "toast-wrapper">
        <div className = "toast-container">
          <span>{content}</span>
        </div>
      </div>
    </React.Fragment>
  );
};
