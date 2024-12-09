import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PatientsTable from "@/components/patientsTable";

// Zod schema for form validation
const patientRegistrationSchema = z.object({
  disease: z
    .string()
    .min(2, { message: "Disease must be at least 2 characters." }),
  symptoms: z.string().min(3, { message: "Symptoms description is required." }),
  duration: z.string().min(1, { message: "Duration is required." }),
  amount_required: z.coerce
    .number()
    .positive({ message: "Amount required must be a positive number." }),
  amount_paid: z.coerce
    .number()
    .nonnegative({ message: "Amount paid cannot be negative." }),
  treatment: z
    .string()
    .min(2, { message: "Treatment description is required." }),
});

const AdminPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize the form with react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      disease: "",
      symptoms: "",
      duration: "",
      amount_required: 0,
      amount_paid: 0,
      treatment: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/patients/register-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register patient");
      }

      const result = await response.json();
      setSubmitSuccess(true);
      form.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-5">
      <PatientsTable changed={submitSuccess} />
      <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Patient Registration
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="disease"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disease</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter disease" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe symptoms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="Duration of symptoms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Required</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total treatment cost"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount_paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount already paid"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Required</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe treatment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="text-red-500 text-sm">{submitError}</div>
            )}

            {submitSuccess && (
              <div className="text-green-500 text-sm">
                Patient registered successfully!
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-slate-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Patient"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminPage;
