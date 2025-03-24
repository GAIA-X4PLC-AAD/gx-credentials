import { generateJWT } from "@/lib/utils";
import { Credential } from "@/model/credential";
import { NextResponse } from "next/server";

// Helper endpoint to fetch all employee and company credentials for determining the user role when authorizing
// See: frontend/auth.ts
export async function GET() {
  const url = new URL(`${process.env.BACKEND_API_URL}/api/credential`);

  // The separate backend just checks if the token is generated using the same secret
  const jwt = await generateJWT({
    id: "AUTHORIZING",
  });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  const credentials = (await response.json()) as {
    employee: Credential[];
    company: Credential[];
  };
  return NextResponse.json({ credentials });
}
