"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  LoadingPage,
  EmptyState,
} from "@/app/components";
import Link from "next/link";
import { SkeletonList } from "../components/Skeleton";
import { fetchCheckIns, fetchProjects, fetchRisk } from "@/lib/utils/api";
import { isCurrentWeek } from "@/lib/utils/checkInhelpers";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { EmployeeCheckIn, Risk } from "@/lib/types";




export default function EmployeeDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const[risks,setRisks]=useState<Risk[]>([]);
  const [checkIns,setCheckIns]=useState<EmployeeCheckIn[]>([]);

 useProtectedRoute(setUser,{employeeHome:true,setProjects,setUser,setCheckIns,setRisks},"employee",setIsLoading)

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

  const openRisks = risks.filter((r) => r.solved);
  const thisWeekCount=openRisks.filter((risk)=>isCurrentWeek(risk.timeStamp)).length+checkIns.filter((checkIn)=>isCurrentWeek(checkIn.timeStamp)).length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor your assigned projects and submit progress
        </p>
      </div>

      {/* Quick Stats */}
   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

  <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <CardBody className="text-center p-6">
      <div className="text-4xl font-bold text-blue-600 mb-2 flex justify-center items-center gap-2">
        📁 {projects.length}
      </div>
      <p className="text-sm text-gray-600 uppercase tracking-wide">Assigned Projects</p>
    </CardBody>
  </Card>

  <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <CardBody className="text-center p-6">
      <div className="text-4xl font-bold text-yellow-600 mb-2 flex justify-center items-center gap-2">
        ⏳ {checkIns.length}
      </div>
      <p className="text-sm text-gray-600 uppercase tracking-wide">Pending Check-ins</p>
    </CardBody>
  </Card>

  <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <CardBody className="text-center p-6">
      <div className="text-4xl font-bold text-red-600 mb-2 flex justify-center items-center gap-2">
        ⚠️ {openRisks.length}
      </div>
      <p className="text-sm text-gray-600 uppercase tracking-wide">Open Risks</p>
    </CardBody>
  </Card>

  <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <CardBody className="text-center p-6">
      <div className="text-4xl font-bold text-green-600 mb-2 flex justify-center items-center gap-2">
        📅 {thisWeekCount}
      </div>
      <p className="text-sm text-gray-600 uppercase tracking-wide">This Week</p>
    </CardBody>
  </Card>

</div>


  

      {/* Recent Check-ins */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recent Check-ins
        </h2>
        {checkIns.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                title="No Check-ins Yet"
                description="Submit your first weekly check-in to get started"
                action={{
                  label: "Submit Check-in",
                  href: "/employee/check-ins",
                }}
              />
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0,4).map((checkIn) => (
            
                <Card key={checkIn._id} hover>
                <CardBody className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">

  <div className="flex items-start justify-between">
    <div className="flex-1">
      {/* Project Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        🚀 {checkIn.projectName}
      </h3>

      {/* Progress Summary */}
      <p className="text-base text-gray-700 mb-3">
        {checkIn.progressSummary}
      </p>

      {/* Additional Info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          💪 Confidence: <span className="font-semibold text-gray-900">{checkIn.confidenceLevel}/5</span>
        </span>
        <span className="flex items-center gap-1">
          📈 Progress: <span className="font-semibold text-gray-900">{checkIn.completionPercentage}%</span>
        </span>
        <span className="flex items-center gap-1">
          🕒 {new Date(checkIn.timeStamp).toLocaleDateString()}
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

      {/* Open Risks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Open Risks</h2>
        {openRisks.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-600">No open risks ✓</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {openRisks.slice(0,4).map((risk) => (
              <Card key={risk._id} className="border-l-4 border-red-600">
            <CardBody className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">

  <div className="flex items-start justify-between">
    <div className="flex-1">
      {/* Risk Title + Severity */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          ⚠️ {risk.title}
        </h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            risk.severity === "high"
              ? "bg-red-100 text-red-800"
              : risk.severity === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {risk.severity.toUpperCase()}
        </span>
      </div>

      {/* Project Name */}
      <p className="text-base text-gray-700 mb-1 flex items-center gap-2">
        📌 Project: <span className="font-semibold">{risk.projectName}</span>
      </p>

      {/* Created Date */}
      <p className="text-sm text-gray-500 flex items-center gap-2">
        🕒 Created: {new Date(risk.timeStamp).toLocaleDateString()}
      </p>
    </div>
  </div>

</CardBody>

              </Card>
            ))}
          </div>
        )}
      </div>

    
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recently Assigned Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects?.length > 0 ? (
            projects.slice(0,4).map((project) => (
              
                <Card key={project._id} hover>
               <CardBody className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">

  {/* Project Name */}
  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
    🚀 {project.name}
  </h3>

  {/* Project Info */}
  <div className="space-y-2 text-gray-700">

    <p className="text-base flex items-center gap-2">
      📅 Start Date: <span className="font-semibold text-green-700">{new Date(project.startDate).toLocaleDateString()}</span>
    </p>

    <p className="text-base flex items-center gap-2">
      🏢 Client: <span className="font-semibold text-blue-700">{project.clientEmail || project.clientName}</span>
    </p>

    <p className="text-base flex items-center gap-2">
      👤 Admin: <span className="font-semibold text-purple-700">{project.adminName}</span>
    </p>

    <p className="text-base flex items-center gap-2">
      🛑 End Date: <span className="font-semibold text-red-700">{new Date(project.endDate).toLocaleDateString()}</span>
    </p>

    <p className="text-base flex items-center gap-2">
      👥 Team Size: <span className="font-semibold text-indigo-700">{project.employeeList?.length || 0}</span>
    </p>

  </div>
</CardBody>

                </Card>
            
            ))
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <EmptyState
                  title="No Projects Assigned"
                  description="No projects assigned to you yet"
                />
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
