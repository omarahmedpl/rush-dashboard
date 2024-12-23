import React from "react";

const InputFieldWithLabel = ({ label, id, name, type, ...props }) => {
  return (
    <div className="inputWithLabel d-flex flex-column" style={{ gap: "4px" }}>
      <label className="loginLabel" htmlFor={id}>{label}</label>
      <input type={type} id={id} name={name} {...props} />
    </div>
  );
};

export default InputFieldWithLabel;
