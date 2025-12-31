"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
  EmptyState,
} from "@/app/components";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { createEmployeeHook } from "@/lib/hooks/employee";
import { validateEmployeeForm } from "@/lib/utils/adminHelpers";
import { SkeletonList } from "@/app/components/Skeleton";

export default function EmployeeManagementPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [user, setUser] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    assignedProjects: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useProtectedRoute(
    setUser,
    { userAdmin: true, setProjects, setEmployeeList },
    "admin",
    setIsLoading
  );

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmployeeForm(newEmployee, setErrors)) return;

    setIsSubmitting(true);
    createEmployeeHook(
      newEmployee,
      setErrors,
      user,
      setProjects,
      setEmployeeList,
      setShowAddForm,
      setNewEmployee,
      setIsSubmitting
    );
  };

  const getEmployeeProjects = (email: string) =>
    projects.filter(p => p.employeeList?.includes(email));

  if (isLoading) return <SkeletonList />;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-gray-500 mt-1">
            Assign employees to projects and track involvement
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
        >
          {showAddForm ? "Cancel" : "+ Add Employee"}
        </Button>
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
          <CardBody>
            <form onSubmit={handleAddEmployee} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee Name *"
                  value={newEmployee.name}
                  onChange={e =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  error={errors.name}
                />

                <Input
                  label="Email Address *"
                  type="email"
                  value={newEmployee.email}
                  onChange={e =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  error={errors.email}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Projects
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded-lg border p-4">
                  {projects.map(project => (
                    <label
                      key={project._id}
                      className="flex items-center gap-3 text-sm cursor-pointer hover:bg-blue-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-600"
                        checked={newEmployee.assignedProjects.includes(project._id)}
                        onChange={() =>
                          setNewEmployee(prev => ({
                            ...prev,
                            assignedProjects: prev.assignedProjects.includes(project._id)
                              ? prev.assignedProjects.filter(id => id !== project._id)
                              : [...prev.assignedProjects, project._id],
                          }))
                        }
                      />
                      <span className="font-medium text-gray-800">
                        {project.name}
                      </span>
                    </label>
                  ))}
                </div>

                {errors.projects && (
                  <p className="text-sm text-red-600 mt-1">{errors.projects}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeList.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                title="No Employees"
                description="Add your first employee to get started"
              />
            </CardBody>
          </Card>
        ) : (
          employeeList.map(emp => {
            const assignedProjects = getEmployeeProjects(emp.email);

            return (
           <Card
  key={emp.email}
  className="border-0 shadow-lg hover:shadow-2xl transition-all rounded-2xl bg-gradient-to-br from-white to-gray-50"
>
  <CardBody className="space-y-5 p-5">

    {/* Email Section */}
    <div>
      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        📧 {emp.email}
      </h3>
      <p className="text-base text-gray-600 mt-1">
        Assigned to{" "}
        <span className="font-bold text-blue-600">{assignedProjects.length}</span>{" "}
        project{assignedProjects.length !== 1 && "s"} 🗂️
      </p>
    </div>

    {/* Project Chips */}
    <div className="flex flex-wrap gap-3 mt-3">
      {assignedProjects.length === 0 ? (
        <span className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
          ❌ No projects assigned
        </span>
      ) : (
        assignedProjects.map((p) => (
          <span
            key={p._id}
            className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-800 hover:from-blue-300 hover:to-indigo-300 transition-all  flex items-center gap-1"
          >
            📌 {p.name}
          </span>
        ))
      )}
    </div>
  </CardBody>
</Card>

            );
          })
        )}
      </div>
    </div>
  );
}
