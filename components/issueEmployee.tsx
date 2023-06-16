import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../hooks/useProtected";
import { issueEmployeeCredential } from "../lib/credentials";
import { EmployeeApplication } from "@/types/CompanyApplication";
import axios from "axios";
import { useRouter } from "next/router";
import { writeTrustedIssuerLog } from "@/lib/registryInteraction";
import {
  getAddressRolesFromDb,
  getApplicationsFromDb,
  updateApplicationStatusInDb,
} from "@/lib/database";
import {
  ADDRESS_ROLES,
  APPLICATION_STATUS,
  COLLECTIONS,
} from "@/constants/constants";

export default function IssueEmployee(props: any) {
  const { data: session } = useSession();
  const [applications, setApplications] = React.useState<
    EmployeeApplication[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      let issuers = await getApplicationsFromDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
        session?.user?.pkh,
      );
      setApplications(
        issuers.map((issuer: any) => ({
          ...issuer.data,
        })),
      );
    };

    fetchData();
  }, []);

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const handleEmployeeIssuance = async (application: EmployeeApplication) => {
    let credential = null;
    try {
      // Issue credential
      credential = await issueEmployeeCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      console.log("Error issuing credential: ", error);
      return;
    }

    // await delay(2000);

    // try {
    //   // Publish credential to issuer registry
    //   await writeTrustedIssuerLog(application.address);
    // } catch (error) {
    //   console.log("Error publishing credential to issuer registry: ", error);
    //   return;
    // }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "employee",
        applicationKey: application.address + "-" + application.timestamp,
      })
      .then(async function (response) {
        const updatedApplications: any = await getApplicationsFromDb(
          COLLECTIONS.EMPLOYEE_APPLICATIONS,
          session?.user?.pkh,
        );
        setApplications(updatedApplications);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRejectEmployeeIssuance = async (
    application: EmployeeApplication,
  ) => {
    try {
      // Update database with credential issuance
      await updateApplicationStatusInDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
        application.address + "-" + application.timestamp,
        APPLICATION_STATUS.REJECTED,
      );
      const updatedApplications: any = await getApplicationsFromDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.log("Error updating application status: ", error);
    }
  };

  console.log("Applications: ", applications);
  const whiteShadow = {
    boxShadow: "0px 0px 10px 3px rgba(255,255,255,0.75)",
  };

  return (
    <>
      <h2>Employee Applications</h2>
      <div
        className="overflow-x-auto shadow rounded-lg border border-white"
        style={whiteShadow}
      >
        <table className="min-w-full text-center text-sm font-light">
          <thead className="border-b bg-gray-500 font-medium border-neutral-500 text-black">
            <tr>
              <th scope="col" className=" px-6 py-4">
                Employee Id
              </th>
              <th scope="col" className=" px-6 py-4">
                Employee Name
              </th>
              <th scope="col" className=" px-6 py-4">
                Company Name
              </th>
              <th scope="col" className=" px-6 py-4">
                Address
              </th>
              <th scope="col" className=" px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="text-white">
            {applications &&
              applications
                ?.filter(
                  (application: any) =>
                    session?.user?.pkh === application.companyId,
                )
                .map((application: any) => (
                  <tr
                    className="border-b border-neutral-500"
                    key={application.address}
                  >
                    <td className="whitespace-nowrap  px-6 py-4 font-medium">
                      {application.employeeId}
                    </td>
                    <td className="whitespace-nowrap  px-6 py-4">
                      {application.name}
                    </td>
                    <td className="whitespace-nowrap  px-6 py-4">
                      {application.companyName}
                    </td>
                    <td className="whitespace-nowrap  px-6 py-4">
                      {application.address}
                    </td>
                    {application.status === "pending" ? (
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handleEmployeeIssuance(application)}
                          className="mr-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleRejectEmployeeIssuance(application)
                          }
                        >
                          Reject
                        </button>
                      </td>
                    ) : application.status === "approved" ? (
                      <td>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                          Approved
                        </span>
                      </td>
                    ) : (
                      <td>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium  bg-red-200 text-red-700">
                          Rejected
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// export async function getServerSideProps(context: NextPageContext) {
//   try {
//     console.log("Inside getServerSideProps");

//     const session = await getSession(context);
//     if (!session) {
//       return {
//         redirect: {
//           destination: "/",
//           permanent: false,
//         },
//       };
//     }

//     // If the user is not a company that has been approved by the registrars, redirect to unauthorised page
//     const addressRole: any = await getAddressRolesFromDb(session?.user?.pkh);

//     // Logging in first time
//     if (!addressRole) {
//       return {
//         redirect: {
//           destination: "/apply",
//           permanent: false,
//         },
//       };
//     }

//     console.log("addressRole: ", addressRole);
//     const role = Array.isArray(addressRole)
//       ? addressRole[0].role
//       : addressRole.role;
//     if (role === ADDRESS_ROLES.COMPANY_APPLIED) {
//       return {
//         redirect: {
//           destination: "/common/pending",
//           permanent: false,
//         },
//       };
//     } else if (role === ADDRESS_ROLES.COMPANY_REJECTED) {
//       return {
//         redirect: {
//           destination: "/common/rejected",
//           permanent: false,
//         },
//       };
//     }

//     return {
//       props: {
//         employeeApplications: await getApplicationsFromDb(
//           COLLECTIONS.EMPLOYEE_APPLICATIONS,
//         ),
//       },
//     };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/common/error",
//         permanent: false,
//       },
//     };
//   }
// }
