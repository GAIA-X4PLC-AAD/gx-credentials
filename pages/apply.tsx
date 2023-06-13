import React from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { getRegistrars } from "../lib/registryInteraction";
import { getAddressRolesFromDb } from "../lib/database";
import { ADDRESS_ROLES } from "@/constants/constants";

export default function Apply() {
  return (
    <main className="h-screen flex flex-col align-center">
      <div className="flex justify-center">
        <p>
          You are still unknown to our system. Do you wish to apply for a
          specific credential?
        </p>
      </div>
      <div className="flex justify-center">
        <button className="m-2">
          <Link href="/apply/applyAsCompany">Apply as Company</Link>
        </button>
        <button className="m-2">
          <Link href="/apply/applyAsEmployee">Apply as Employee</Link>
        </button>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const registrars = await getRegistrars();
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/issue/issueCompany",
        permanent: false,
      },
    };
  }

  // TODO should first redirect to issuance page for companies with optional link to cred takeout
  const addressRole: any = await getAddressRolesFromDb(session.user.pkh);
  if (addressRole) {
    const role = Array.isArray(addressRole)
      ? addressRole[0].role
      : addressRole.role;
    if (
      role === ADDRESS_ROLES.COMPANY_APPROVED ||
      role === ADDRESS_ROLES.EMPLOYEE_APPROVED
    ) {
      return {
        redirect: {
          destination: "/takeout",
          permanent: false,
        },
      };
    } else if (
      role === ADDRESS_ROLES.COMPANY_APPLIED ||
      role === ADDRESS_ROLES.EMPLOYEE_APPLIED
    ) {
      return {
        redirect: {
          destination: "/common/pending",
          permanent: false,
        },
      };
    } else if (
      role === ADDRESS_ROLES.COMPANY_REJECTED ||
      role === ADDRESS_ROLES.EMPLOYEE_REJECTED
    ) {
      return {
        redirect: {
          destination: "/common/rejected",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
