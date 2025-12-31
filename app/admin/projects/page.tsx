"use client";

import { useRouter } from "next/navigation";  
import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  EmptyState,
} from "@/app/components";
import Link from "next/link";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { SkeletonList } from "@/app/components/Skeleton";
import { calculateHealth, getHealthStatus, getHealthColor, getHealthBgColor } from "@/lib/utils/healthScoreCalculator";

export default function ProjectsListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user,setUser]=useState(null)
  const [risks,setRisks]=useState<any[]>([])
  const [feedbacks,setFeedbacks]=useState<any[]>([])
  const [checkIns,setCheckIns]=useState<any[]>([])

  useProtectedRoute(setUser,{homeAdmin:true,setProjects,setRisks,setFeedbacks,setCheckIns},"admin",setIsLoading)

  if (isLoading) return <SkeletonList />;
 


  const displayProjects = projects;

  const getProjectData = (projectId: string) => {
    const projectCheckIns = checkIns.filter(c => c.projectId === projectId);
    const projectRisks = risks.filter(r => r.projectId === projectId);
    const projectFeedbacks = feedbacks.filter(f => f.projectId === projectId);
    return { projectCheckIns, projectRisks, projectFeedbacks };
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600 text-lg">Manage and monitor all your active projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
            + New Project
          </Button>
        </Link>
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
            <Link key={project._id}
  href={{
    pathname: `/admin/projects/${project._id}`,
    query: {
      id: project._id,
      name: project.name,
      description: project.description,
      clientEmail: project.clientEmail,
      startDate: project.startDate,
      endDate: project.endDate,
      adminId: project.adminId,
      adminName: project.adminName,
      employeeList: JSON.stringify(project.employeeList || [])
    }
  }}
>

                <Card className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 bg-white rounded-xl">
               <CardBody className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">

  {/* Project Header */}
  <div className="flex items-start justify-between mb-5">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🚀 {project.name}
        </h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${healthBg} ${healthColor}`}>
          {healthStatus.replace("_", " ").toUpperCase()}
        </span>
      </div>
      <p className="text-gray-700 text-base leading-relaxed line-clamp-2">
        {project.description}
      </p>
    </div>
  </div>

  {/* Project Info Grid */}
  <div className="grid grid-cols-2 gap-5 pt-5 border-t border-gray-200">
    
    {/* Client Email */}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">📧 Client Email</p>
      <p className="text-base font-medium text-blue-700 truncate">{project.clientEmail}</p>
    </div>

    {/* Team Size */}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">👥 Team Size</p>
      <p className="text-base font-medium text-purple-700">{project.employeeList?.length || 0} members</p>
    </div>

    {/* Start Date */}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">📅 Start Date</p>
      <p className="text-base font-medium text-green-700">{new Date(project.startDate).toLocaleDateString()}</p>
    </div>

    {/* End Date */}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">🛑 End Date</p>
      <p className="text-base font-medium text-red-700">{new Date(project.endDate).toLocaleDateString()}</p>
    </div>

    {/* Health Score */}
    <div className="space-y-1 col-span-2">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">💚 Health Score</p>
      <div className="flex items-center gap-3">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${healthScore}%`,
              backgroundColor:
                healthScore >= 80 ? "#16a34a" : healthScore >= 60 ? "#ca8a04" : "#dc2626",
            }}
          ></div>
        </div>
        <span className="text-base font-bold text-gray-900">{healthScore}%</span>
      </div>
    </div>

  </div>
</CardBody>

                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
