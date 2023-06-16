import { EmployeeApplication } from "@/types/CompanyApplication";
import React from "react";
import { issueEmployeeCredential } from "../lib/credentials";

const IssueEmployeeCredentialsTable = (props: any) => {
  const applications = props?.props.applications as EmployeeApplication[];
  const handleEmployeeIssuance = props?.props.handleEmployeeIssuance;
  const handleRejectEmployeeIssuance =
    props?.props.handleRejectEmployeeIssuance;

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
              applications.map((application: any) => (
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
};

export default IssueEmployeeCredentialsTable;
