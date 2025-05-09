import { Textarea } from "../ui/textarea";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApplicationFormDisplayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function ApplicationFormDisplay({
  data,
}: ApplicationFormDisplayProps) {
  const isEmployee = Object.prototype.hasOwnProperty.call(data, "role");

  return isEmployee ? (
    <EmployeeDisplayForm data={data} />
  ) : (
    <CompanyDisplayForm data={data} />
  );
}

function EmployeeDisplayForm({ data }: ApplicationFormDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="legalName">Legal Name</Label>
        <Input
          id="legalName"
          value={data.legalName}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={data.role}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={data.email}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={data.companyName}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyAddress">Company Address</Label>
        <Input
          id="companyAddress"
          value={data.companyAddress}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="applicationText">Application Text</Label>
        <Textarea
          id="applicationText"
          value={data.applicationText}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
    </div>
  );
}

function CompanyDisplayForm({ data }: ApplicationFormDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="legalName">Legal Name</Label>
        <Input
          id="legalName"
          value={data.legalName}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="legalAddress">Legal Address</Label>
        <Input
          id="legalAddress"
          value={data.legalAddress}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subOrganization">Subsidiary Organization</Label>
        <Input
          id="subOrganization"
          value={data.subOrganization}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headquarterAddress">Headquarters Address</Label>
        <Input
          id="headquarterAddress"
          value={data.headquarterAddress}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentOrganization">Parent Organization</Label>
        <Input
          id="parentOrganization"
          value={data.parentOrganization}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          value={data.registrationNumber}
          readOnly
          className="bg-muted cursor-default focus:ring-0"
        />
      </div>
    </div>
  );
}
