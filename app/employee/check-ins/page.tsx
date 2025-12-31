"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardBody, Button, EmptyState } from "@/app/components";
import Link from "next/link";
import { SkeletonList } from "@/app/components/Skeleton";
import { hasPassed, isCurrentWeek } from "@/lib/utils/checkInhelpers";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";

function getDaysUntilNextWeek() {
  const now = new Date();
  const day = now.getDay(); // Sunday = 0
  return day === 0 ? 1 : 8 - day;
}

export default function CheckInsList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);

  useProtectedRoute(
    setUser,
    { employeeCheckInGet: true, setProjects, setCheckIns },
    "employee",
    setIsLoading
  );

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

 
  const thisWeekProjectSet = new Set(
    checkIns.filter(c => isCurrentWeek(c.timeStamp)).map(c => c.projectId)
  );

  const runningProjects = projects.filter(p => !hasPassed(p.endDate));
  const submittedCount = thisWeekProjectSet.size;
  const totalRunning = runningProjects.length;
  const completionPercent =
    totalRunning === 0
      ? 0
      : Math.round((submittedCount / totalRunning) * 100);

  const daysLeft = getDaysUntilNextWeek();

  return (
    <div className="p-6 space-y-12">
      {/* ---------------- Header ---------------- */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Weekly Check-ins
        </h1>
        <p className="text-gray-600 text-lg">
          One check-in per project, per week
        </p>

        {/* Countdown */}
        <div
          className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full
                     bg-gradient-to-r from-indigo-500 to-cyan-500
                     text-white text-sm font-semibold shadow-md animate-pulse"
        >
          ⏳ Next check-in in {daysLeft} day{daysLeft > 1 && "s"}
        </div>
      </div>

      {/* ---------------- Stats ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Submitted", value: submittedCount },
          { label: "Pending", value: totalRunning - submittedCount },
          { label: "Completion", value: `${completionPercent}%` },
        ].map((item, i) => (
          <Card
            key={i}
            className="border-0 bg-gradient-to-br from-white to-indigo-50 shadow-lg"
          >
            <CardBody className="text-center py-7">
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {item.value}
              </div>
              <p className="text-sm text-gray-600">{item.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ---------------- Submit Check-ins ---------------- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Submit Check-in
        </h2>

        <div className="space-y-4">
          {projects.map(project => {
            const ended = hasPassed(project.endDate);
            const submitted = thisWeekProjectSet.has(project._id);

            return (
              <Card
                key={project._id}
                className="border-0 bg-white hover:shadow-xl
                           hover:-translate-y-1 transition-all duration-300"
              >
              <CardBody className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md transition-all">

  <div>
    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
      📁 {project.name}
    </h3>
    <p className="text-sm text-gray-600">
      Client: <span className="font-medium">{project.clientEmail || "N/A"}</span>
    </p>
  </div>

  {ended || submitted ? (
    <span className="text-sm font-semibold text-gray-500">
      {ended ? "✅ Project Ended" : "📤 Submitted this week"}
    </span>
  ) : (
    <Link
      href={{
        pathname: `/employee/check-ins/${project._id}`,
        query: {
          id: project._id,
          name: project.name,
          description: project.description,
          clientEmail: project.clientEmail,
          startDate: project.startDate,
          endDate: project.endDate,
          adminId: project.adminId,
          adminName: project.adminName,
          employeeList: JSON.stringify(project.employeeList || []),
        },
      }}
    >
      <Button
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition"
      >
        ✏️ New Check-in
      </Button>
    </Link>
  )}
</CardBody>

              </Card>
            );
          })}
        </div>
      </div>

     
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Check-in Timeline
        </h2>

        {checkIns.length === 0 ? (
          <Card className="border-0 bg-gray-50">
            <CardBody>
              <EmptyState
                title="No Check-ins Yet"
                description="Your weekly updates will appear here"
              />
            </CardBody>
          </Card>
        ) : (
          <div className="relative pl-6 space-y-6">
            {/* vertical line */}
            <div
              className="absolute left-2 top-0 bottom-0 w-1
                         bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full"
            />

            {checkIns.map((checkIn, i) => (
              <Card
                key={checkIn._id}
                className="border-0 bg-white shadow-md
                           hover:shadow-xl hover:-translate-y-1
                           transition-all duration-300"
              >
               <CardBody className="relative space-y-5 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">

  {/* Timeline Dot */}
  <div
    className="absolute -left-8 top-8 w-4 h-4 rounded-full
               bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-md"
  />

  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        📌 {checkIn.projectName}
      </h3>
      <p className="text-sm text-gray-600">
        Client: <span className="font-medium">{checkIn.clientEmail || "N/A"}</span>
      </p>
    </div>

    <div className="text-right text-xs text-gray-500">
      <div className="font-semibold">Week {checkIn.week}</div>
      <div>{new Date(checkIn.timeStamp).toLocaleDateString()}</div>
    </div>
  </div>

  {/* Progress Summary */}
  <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100">
    <p className="text-xs font-semibold text-gray-500 mb-1">📈 Progress Summary</p>
    <p className="text-sm text-gray-700 leading-relaxed">
      {checkIn.progressSummary || "No summary provided"}
    </p>
  </div>

  {/* Blockers */}
  <div className="rounded-xl p-4 bg-gray-50 border border-gray-200">
    <p className="text-xs font-semibold text-gray-500 mb-1">🚧 Blockers</p>
    <p className="text-sm text-gray-700">
      {checkIn.blockers || "No blockers reported"}
    </p>
  </div>

  {/* Metrics */}
  <div className="grid grid-cols-2 gap-4 pt-2">

    {/* Completion */}
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">✅ Completion</p>
      <div className="flex items-center gap-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${checkIn.completionPercentage || 0}%`,
              background:
                checkIn.completionPercentage >= 80
                  ? "linear-gradient(to right,#22c55e,#16a34a)"
                  : checkIn.completionPercentage >= 50
                  ? "linear-gradient(to right,#facc15,#eab308)"
                  : "linear-gradient(to right,#fb7185,#e11d48)",
            }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700">
          {checkIn.completionPercentage || 0}%
        </span>
      </div>
    </div>

    {/* Confidence */}
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">🔥 Confidence</p>
      <div className="flex items-center gap-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-cyan-500"
            style={{
              width: `${((checkIn.confidenceLevel || 0) / 5) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm font-bold text-gray-700">
          {checkIn.confidenceLevel || 0}/5
        </span>
      </div>
    </div>

  </div>
</CardBody>

              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
