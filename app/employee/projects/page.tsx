"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  HealthScoreBadge,
  LoadingPage,
  EmptyState,
  Button,
} from "@/app/components";
import Link from "next/link";
import { SkeletonList } from "@/app/components/Skeleton";
import { fetchProjects } from "@/lib/utils/api";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { calculateHealth, getHealthStatus, getHealthColor, getHealthBgColor } from "@/lib/utils/healthScoreCalculator";

export default function EmployeeProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [risks,setRisks]=useState<any[]>([])
    const [feedbacks,setFeedbacks]=useState<any[]>([])
    const [checkIns,setCheckIns]=useState<any[]>([])


  useProtectedRoute(setUser,{employeeProjects:true,setProjects,setCheckIns,setFeedbacks,setRisks},"employee",setIsLoading)

 // console.log("here is the projects", projects);
   const getProjectData = (projectId: string) => {
    const projectCheckIns = checkIns.filter(c => c.projectId === projectId);
    const projectRisks = risks.filter(r => r.projectId === projectId);
    const projectFeedbacks = feedbacks.filter(f => f.projectId === projectId);
    return { projectCheckIns, projectRisks, projectFeedbacks };
  };
 const displayProjects=projects

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

   return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600 text-lg">Monitor all your active projects</p>
        </div>
   
      </div>

      {displayProjects.length === 0 ? (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardBody>
            <EmptyState
              title="No Projects Yet"
              description="Create your first project to get started"
              action={{ label: "Create Project", href: "/admin/projects/new" }}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayProjects.map(project => {
            const { projectCheckIns, projectRisks, projectFeedbacks } = getProjectData(project._id);
            const daysElapsed = (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24);
            const totalDays = (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24);
            const avgCompletion = projectCheckIns.length > 0 ? projectCheckIns.reduce((sum, c) => sum + c.completionPercentage, 0) / projectCheckIns.length : 0;

            const healthScore = calculateHealth({
              clientFeedbacks: projectFeedbacks,
              employeeCheckIns: projectCheckIns,
              risks: projectRisks,
              completionPercentage: avgCompletion,
              daysElapsed,
              totalDays
            });

            const healthStatus = getHealthStatus(healthScore);
            const healthColor = getHealthColor(healthScore);
            const healthBg = getHealthBgColor(healthScore);
              // Color logic for health bar
  const healthBarColor = healthColor.replace("text-", "bg-");


            return (
        

                <Card key={project._id} className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-white rounded-xl">
             <CardBody className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">

  {/* Project Header */}
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🚀 {project.name}
        </h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${healthBg} ${healthColor}`}>
          {healthStatus.replace("_", " ").toUpperCase()}
        </span>
      </div>
      <p className="text-base text-gray-700 leading-relaxed line-clamp-2">
        {project.description}
      </p>
    </div>
  </div>

  {/* Project Details */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">

    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">📧 Client Email</p>
      <p className="text-sm font-bold text-blue-700 truncate">{project.clientEmail}</p>
    </div>

    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">👥 Team Size</p>
      <p className="text-sm font-bold text-purple-700">{project.employeeList?.length || 0} members</p>
    </div>

    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">📅 Start Date</p>
      <p className="text-sm font-bold text-green-700">{new Date(project.startDate).toLocaleDateString()}</p>
    </div>

    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">🛑 End Date</p>
      <p className="text-sm font-bold text-red-700">{new Date(project.endDate).toLocaleDateString()}</p>
    </div>

    {/* Health Score */}
    <div className="space-y-1 col-span-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">💓 Health Score</p>
      <div className="flex items-center gap-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${healthScore}%`,
              backgroundColor:
                healthScore >= 80
                  ? "#16a34a"
                  : healthScore >= 60
                  ? "#ca8a04"
                  : "#dc2626",
            }}
          ></div>
        </div>
        <span className="text-sm font-bold text-gray-900">{healthScore}%</span>
      </div>
    </div>

  </div>
</CardBody>

                </Card>
              
            );
          })}
        </div>
      )}
    </div>
  );
}
