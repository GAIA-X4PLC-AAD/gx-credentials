"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useCreateApplication } from "@/hooks/api/application";
import { toast } from "@/hooks/use-toast";
import { ResetIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  pkh: z.string().min(36, {
    message: "Public Key Hash must be at least 36 characters.",
  }),
  legalName: z.string().min(1, {
    message: "Legal Name is required.",
  }),
  registrationNumber: z.string().min(1, {
    message: "Registration Number is required.",
  }),
  headquarterAddress: z.string().min(1, {
    message: "Headquarters Address is required.",
  }),
  legalAddress: z.string().min(1, {
    message: "Legal Address is required.",
  }),
  parentOrganization: z.string().min(1, {
    message: "Parent Organization is required.",
  }),
  subOrganization: z.string().min(1, {
    message: "Sub Organization is required.",
  }),
});

const Page = () => {
  const { mutateAsync } = useCreateApplication();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pkh: session?.user?.pkh,
      legalName: "",
      registrationNumber: "",
      headquarterAddress: "",
      legalAddress: "",
      parentOrganization: "",
      subOrganization: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { pkh, ...rest } = values;
      const formData = {
        pkh,
        metadata: {
          ...rest,
        },
        type: "company",
      } as const;
      mutateAsync(formData).then(() => {
        form.reset();
      });
      toast({
        title: "Success",
        description: "Application created successfully.",
      });
    } catch (error) {
      console.error("Error creating company application:", error);
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
              <FormMessage />
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
            name="registrationNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="headquarterAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headquarters Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter headquarters address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter legal address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="parentOrganization"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Parent Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter parent organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subOrganization"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Sub Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sub organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full space-x-2 justify-between">
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
            <ResetIcon className="w-4 h-4 mr-1" />
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
