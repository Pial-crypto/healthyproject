"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Alert,
  EmptyState,
} from "@/app/components";
import Link from "next/link";
import { SkeletonList } from "@/app/components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { validateForm } from "@/lib/utils/adminHelpers";
import { updateProjectHook } from "@/lib/hooks/project";
export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // project from query (employees = email array)
  const initialProject = {
    id:projectId,
    name: searchParams.get("name") || "",
    adminId: searchParams.get("adminId") || "",
    adminName: searchParams.get("adminName") || "",
    
    description: searchParams.get("description") || "",
    clientEmail: searchParams.get("clientEmail") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    employeeList: JSON.parse(
      searchParams.get("employeeList") || "[]"
    ) as string[],
  };

  const [projectState, setProjectState] = useState(initialProject);
  const [removedEmployees, setRemovedEmployees] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: initialProject.name,
    description: initialProject.description,
    startDate: initialProject.startDate
      ? initialProject.startDate.slice(0, 10)
      : "",
    endDate: initialProject.endDate
      ? initialProject.endDate.slice(0, 10)
      : "",
  });


  useProtectedRoute(setUser,{projectDetails:true},"admin",setIsLoading)

  if (isLoading) return <SkeletonList></SkeletonList>
  if (!user) return null;

  const hasProjectFromQuery =
    !!initialProject.name || !!initialProject.description;

  if (!hasProjectFromQuery) {
    return <EmptyState title="Project Not Found" description="This project was not created or was removed from the server"   action={{ label: "Back", href: "/admin/projects" }}     ></EmptyState>
   
  }

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
    console.log("ffdsafadfsd")

    if (!validateForm({...formData,clientEmail:initialProject.clientEmail},setErrors)) return;
console.log("sdadsfsdf")
    setIsSubmitting(true);
 await   updateProjectHook(formData
      ,projectState,removedEmployees,initialProject,setShowSuccess,setIsSubmitting,projectId,router )
 
  };


  const handleRemoveEmployee = (email: string) => {
    const updatedList = projectState.employeeList.filter((e) => e !== email);
    setProjectState((prev) => ({
      ...prev,
      employeeList: updatedList,
    }));
    setRemovedEmployees((prev) => [...prev, email]);
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Edit Project
        </h1>
        <p className="text-gray-600 text-lg">
          Update project details and review assigned team members.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardBody>
          {showSuccess && (
            <Alert
              type="success"
              title="Success!"
              message="Project updated successfully"
            />
          )}

       <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white shadow-lg rounded-2xl">

  {/* Project Details Section */}
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      📝 Project Details
    </h2>
    <div className="space-y-5">
      <Input
        label="Project Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., E-commerce Platform Redesign"
        error={errors.name}
        className="text-lg rounded-lg"
      />

      <Textarea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the project"
        rows={4}
        error={errors.description}
        className="text-lg rounded-lg"
      />

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

  {/* Project Information Section */}
  <div className="bg-gray-50 rounded-2xl p-6 space-y-5 shadow-inner">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
      ℹ️ Project Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Client</p>
        <p className="text-lg font-semibold text-gray-900">📧 {initialProject.clientEmail || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
        <p className="text-lg font-semibold text-gray-900">👥 {projectState.employeeList.length} assigned</p>
      </div>
    </div>

    {/* Active employees list */}
    {projectState.employeeList.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 mb-3">Team Members:</p>
        <div className="space-y-2">
          {projectState.employeeList.map((empEmail: string) => (
            <div
              key={empEmail}
              className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition"
            >
              <p className="text-sm font-medium text-gray-900">👤 {empEmail}</p>
              <button
                type="button"
                onClick={() => handleRemoveEmployee(empEmail)}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-300 transition-all"
              >
                Remove ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Removed employees preview */}
    {removedEmployees.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Will be removed after saving:</p>
        <div className="flex flex-wrap gap-2">
          {removedEmployees.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 border border-red-200"
            >
              ✕ {email}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* No team members */}
    {projectState.employeeList.length === 0 && removedEmployees.length === 0 && (
      <p className="text-sm text-gray-500">No team members are currently assigned.</p>
    )}

    <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
      ⚠️ Removing a member here will only be applied after you click Update Project.
    </p>
  </div>

  {/* Buttons */}
  <div className="flex gap-4 pt-6">
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
    >
      {isSubmitting ? "Updating..." : "Update Project"} ✨
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
