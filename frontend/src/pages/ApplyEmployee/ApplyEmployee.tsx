"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResetIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SelectItem,
  SelectTrigger,
  SelectContent,
  Select,
  SelectValue,
} from "@/components/ui/select";
import { useCreateApplication } from "@/hooks/api/application";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";
import { useGetAllCompanies } from "@/hooks/api/credential";

const formSchema = z.object({
  pkh: z.string().min(36, {
    message: "Public Key Hash must be at least 36 characters.",
  }),
  legalName: z.string().min(1, {
    message: "Legal Name is required.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("Invalid email address."),
  companyAddress: z.string().min(1, {
    message: "Company Address is required.",
  }),
  companyName: z.string().min(1, {
    message: "Company is required.",
  }),
  applicationText: z.string().min(1, {
    message: "Application text is required.",
  }),
});

const Page = () => {
  const { mutateAsync } = useCreateApplication();
  const session = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pkh: session?.user?.pkh,
      legalName: "",
      role: "",
      email: "",
      companyAddress: "",
      companyName: "",
      applicationText: "",
    },
  });

  const { companies, isLoading: isLoadingCompanies } = useGetAllCompanies();

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { pkh, ...rest } = values;
      const formData = {
        pkh,
        metadata: {
          ...rest,
        },
        type: "employee",
      } as const;
      mutateAsync(formData).then(() => {
        form.reset();
      });
      toast({
        title: "Success",
        description: "Employee Application created successfully.",
      });
    } catch (error) {
      console.error("Error creating employee application:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the application.",
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pkh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PKH</FormLabel>
              <FormControl>
                <Input placeholder="Public Key Hash" {...field} disabled />
              </FormControl>
              <FormDescription>
                Public key hash of your Tezos account.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="legalName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Legal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter legal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Company</FormLabel>
                <Select
                  onValueChange={value => {
                    form.setValue(
                      "companyName",
                      companies?.find(c => c.pkh === value)?.name || "UNKNOWN"
                    );
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies &&
                      !isLoadingCompanies &&
                      companies.map(company => (
                        <SelectItem key={company.pkh} value={company.pkh}>
                          {company.name}
                        </SelectItem>
                      ))}
                    {companies?.length === 0 && !isLoadingCompanies && (
                      <SelectItem value="0x0">No companies found...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Input placeholder="Public Key Hash" {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="applicationText"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Application Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter application message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-between space-x-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              form.reset();
              toast({
                title: "Form Reset",
                description: "Form has been reset.",
                duration: 2000,
              });
            }}
          >
            <ResetIcon className="mr-1 h-4 w-4" />
            Reset Form
          </Button>
          <Button type="submit" size="lg">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Page;
