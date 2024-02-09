/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";

const ContentCard = (props: any) => {
  const whiteShadow = {
    boxShadow: "0px 0px 10px 3px rgba(255,255,255,0.75)",
  };

  return (
    <>
      <div
        className="max-w-md p-6 mx-3 mt-4 bg-white border border-gray-200 rounded-lg shadow"
        style={whiteShadow}
      >
        <svg
          className="w-12 h-12 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm9-3a1.5 1.5 0 0 1 2.5 1.1 1.4 1.4 0 0 1-1.5 1.5 1 1 0 0 0-1 1V14a1 1 0 1 0 2 0v-.5a3.4 3.4 0 0 0 2.5-3.3 3.5 3.5 0 0 0-7-.3 1 1 0 0 0 2 .1c0-.4.2-.7.5-1Zm1 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          {props.title}
        </h5>
        <h6>{props.subtitle}</h6>
        {props.children}
      </div>
    </>
  );
};

export default ContentCard;
