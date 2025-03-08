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
import { Textarea } from "@/components/ui/textarea";
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
    message: "Parent Organization is required.",
  }),
  applicationText: z.string().min(1, {
    message: "Application text is required.",
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
      role: "",
      email: "",
      companyAddress: "",
      companyName: "",
      applicationText: "",
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
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Company Address</FormLabel>
                <FormControl className="flex-1">
                  <Input placeholder="Enter company address" {...field} />
                </FormControl>
                <FormMessage />
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
