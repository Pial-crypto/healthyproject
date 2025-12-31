"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/app/components";
import { SkeletonList } from "@/app/components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { activityHook } from "@/lib/hooks/activityHook";
import { getActivityIcon } from "@/lib/utils/adminHelpers";

export default function ActivityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useProtectedRoute(
    setUser,
    { setProjects, setCheckIns, setRisks, setFeedbacks },
    "admin",
    setIsLoading
  );

  activityHook(projects, checkIns, risks, feedbacks, setActivities);

  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

  const selectedProject = projects.find(p => p._id === selectedProjectId);

  const projectActivities = activities
    .filter(a => a.projectId === selectedProjectId)
   // .filter(a => !(a.type === "risk_created" ));

  const projectCreated = projectActivities.find(a => a.type === "project_created");
  const restActivities = projectActivities//.filter(a => a.type !== "project_created");
  const finalActivities = projectCreated ? [projectCreated, ...restActivities] : restActivities;

  // Fields mapping for professional display per type
  const displayFields: Record<string, string[]> = {
    project_created: ["name", "startDate", "endDate", "adminName", "clientEmail", "employeeList", "description"],
    check_in: ["progressSummary", "completionPercentage", "confidenceLevel", "employeeEmail", "week","blockers",],
    risk_created: ["title", "severity", "solved", "mitigationPlan", "employeeEmail", "blockers"],
    feedback: ["comment", "satisfactionRating", "communicationClarity", "flaggedIssue", "issueDescription", "clientEmail"],
  };
// console.log(projectActivities,"fdsadsf")
  const getDisplayValue = (key: string, activity: any) => {
    let value = activity[key];
    if ((key === "clientEmail" || key === "employeeEmail") && !value) {
      if (key === "clientEmail") value = selectedProject?.clientEmail;
      if (key === "employeeEmail") value = activity.employeeEmail || "Not Provided";
    }
    if (!value && value !== 0 && value !== false) return "Not Provided";

    if (key === "startDate" || key === "endDate") {
      return new Date(value).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    }

    if (typeof value === "boolean") return value ? "Yes" : "No";

    return value;
  };

  return (
    <div className="px-6 md:px-12 py-8">
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Activity Timeline
      </h1>
      <p className="text-gray-600 mb-10">Project-wise activity history</p>

      <div className="flex gap-3 flex-wrap mb-12">
        {projects.map(p => (
          <button
            key={p._id}
            onClick={() => {
              setSelectedProjectId(p._id);
              setExpanded({});
            }}
            className={`px-5 py-2 rounded-xl font-semibold transition-all
              ${
                selectedProjectId === p._id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-[1.04]"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {selectedProject && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{selectedProject.name}</h2>
          <p className="text-gray-500">Timeline starts from project creation</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-7 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full" />

        <div className="space-y-12">
          {finalActivities.map((activity, idx) => {
            const isRisk = activity.type === "risk_created";
            const isOpen = expanded[idx];

            return (
              <div key={idx} className="flex gap-6 animate-[fadeUp_0.45s_ease-out]">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md
                    ${
                      isRisk
                        ? activity.solved
                          ? "bg-green-100 border border-green-400"
                          : "bg-red-100 border border-red-400 animate-pulse"
                        : "bg-white border border-gray-300"
                    }`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <Card className="flex-1">
                  <CardBody>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {activity.type.replace(/_/g, " ").toUpperCase()}
                      </h3>

                      <button
                        onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        {isOpen ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        {displayFields[activity.type]?.map(field => (
                          <p key={field}>
                            <span className="font-semibold text-gray-800 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}:
                            </span>{" "}
                            <span className="text-gray-600">{getDisplayValue(field, activity)}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    <time className="block mt-5 text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
