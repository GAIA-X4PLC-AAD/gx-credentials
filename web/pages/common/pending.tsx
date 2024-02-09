/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRouter } from "next/router";
import React from "react";

function pending() {
  const router = useRouter();

  return (
    <div className="ml-6">
      <div>
        <b>Thank you for submitting your request. It is under review.</b>
      </div>
      <button onClick={() => router.push("/takeout")} className="mt-2">
        Continue
      </button>
    </div>
  );
}

export default pending;
