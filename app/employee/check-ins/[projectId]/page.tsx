"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Select,
  Button,
  Alert,
  LoadingPage,
  CardFooter,
} from "@/app/components";
import Link from "next/link";
import { createCheckIn } from "@/lib/utils/api";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { Skeleton } from "@mui/material";
import { SkeletonList } from "@/app/components/Skeleton";
import { createCheckInHook, initailFormHook } from "@/lib/hooks/employee";
import { validateCheckIn } from "@/lib/utils/employeeHelpers";

export default function CheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  //  Get projectId from searchParams correctly
  const projectId = searchParams.get("id") as string;
  const projectName = searchParams.get("name") || "Project";
  const clientEmail = searchParams.get("clientEmail") || "Email not found";
  const employeeEmail=user?.email

 


isLoading && <SkeletonList></SkeletonList>
  useProtectedRoute(setUser,{employeeCheckIn:true,},"employee",setIsLoading)

  //console.log(user)

  const [formData, setFormData] = useState({
    projectId: "",
    employeeId: "",
    week: "",
    progressSummary: "",
    blockers: "",
    confidenceLevel: "3",
    completionPercentage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  initailFormHook(user,projectId,setFormData)

  if (isLoading) return <SkeletonList />;
  if (!user || !projectId) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCheckIn(formData,setErrors)) return;

    setIsSubmitting(true);
    createCheckInHook(formData,projectId,projectName,clientEmail,employeeEmail,setShowSuccess,setErrors,setIsSubmitting,router)

  };

   return (
    <div>
      <div className="mb-8">
        <Link
          href="/employee"
          className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Check-In</h1>
        <p className="text-gray-600">{projectName}</p>
      </div>


      <Card className="max-w-2xl">
        <CardHeader>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Week of {new Date().toLocaleDateString()}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Client: {clientEmail}
            </p>
          </div>
        </CardHeader>


        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-6">
            {errors.submit && (
              <Alert type="error" message={errors.submit} />
            )}


            <Textarea
              label="Progress Summary"
              name="progressSummary"
              placeholder="What did you accomplish this week?"
              rows={4}
              value={formData.progressSummary}
              onChange={handleChange}
              error={errors.progressSummary}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Completion Percentage"
                type="number"
                name="completionPercentage"
                min="0"
                max="100"
                placeholder="0-100"
                value={formData.completionPercentage}
                onChange={handleChange}
                error={errors.completionPercentage}
              />


              <Select
                label="Confidence Level"
                name="confidenceLevel"
                value={formData.confidenceLevel}
                onChange={handleChange}
              options={[
                      { value: "1", label: "1 - Very Concerned 😰" },
                      { value: "2", label: "2 - Concerned 😟" },
                      { value: "3", label: "3 - Moderate 😐" },
                      { value: "4", label: "4 - Confident 🙂" },
                      { value: "5", label: "5 - Very Confident 😎" },
                    ]}
              />
            </div>


            <Textarea
              label="Blockers/Challenges (Optional)"
              name="blockers"
              placeholder="What obstacles are you facing?"
              rows={3}
              value={formData.blockers}
              onChange={handleChange}
            />


            <Alert
              type="info"
              message="Your check-in will be reviewed by the project manager and shared with the client."
            />
          </CardBody>


          <CardFooter className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Check-In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );

}
