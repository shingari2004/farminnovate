"use client";

import React, { useState } from "react";

const LanguageInput = () => {
  return (
    <div className="flex items-center">
      <select>
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="pun">PUN</option>
      </select>
    </div>
  );
};

export default LanguageInput;
