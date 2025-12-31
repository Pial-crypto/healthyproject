"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Alert,
} from "@/app/components";
import Link from "next/link";
import { username } from "@/lib/utils/name";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { validateForm } from "@/lib/utils/adminHelpers";
import { SkeletonList } from "@/app/components/Skeleton";
import { createProjectHook } from "@/lib/hooks/project";

export default function NewProjectPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  useProtectedRoute(setUser,{newProject:true},"admin",setIsLoading)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientEmail: "",
 
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isLoading) return <SkeletonList></SkeletonList>
  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData,setErrors)) return;

    setIsSubmitting(true);
createProjectHook(formData,user,username,setShowSuccess,setIsSubmitting,router)

  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="text-blue-600 hover:text-blue-800 inline-block mb-4"
        >
          ← Back to Projects
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Create New Project
        </h1>
        <p className="text-gray-600 text-lg">
          Setup a new project — add employees later
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardBody>
          {showSuccess && (
            <Alert
              type="success"
              title="Success!"
              message="Project created successfully"
            />
          )}

      <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white shadow-lg rounded-2xl">

  {/* Form Title */}
  <div>
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      📝 Project Details
    </h2>

    <div className="space-y-5">

      {/* Project Name */}
      <Input
        label="Project Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        className="text-lg rounded-lg"
      />

      {/* Description */}
      <Textarea
        label="Description *"
        name="description"
        rows={4}
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        className="text-lg rounded-lg"
      />

      {/* Client Email */}
      <Input
        label="Client Email *"
        name="clientEmail"
        type="email"
        placeholder="client@company.com"
        value={formData.clientEmail}
        onChange={handleChange}
        error={errors.clientEmail}
        className="text-lg rounded-lg"
      />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Start Date *"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          className="text-lg rounded-lg"
        />

        <Input
          label="End Date *"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          className="text-lg rounded-lg"
        />
      </div>
    </div>
  </div>

  {/* Actions */}
  <div className="flex gap-4 pt-6">
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
    >
      {isSubmitting ? "Creating..." : "Create Project"} ✨
    </Button>

    <Link href="/admin/projects">
      <Button
        variant="secondary"
        className="text-lg font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
      >
        Cancel ❌
      </Button>
    </Link>
  </div>
</form>

        </CardBody>
      </Card>
    </div>
  );
}
