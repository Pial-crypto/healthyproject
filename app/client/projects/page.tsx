"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  EmptyState,
  
} from "@/app/components";
import { SkeletonList } from "@/app/components/Skeleton";
import Link from "next/link";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { calculateHealth, getHealthStatus, getHealthColor, getHealthBgColor } from "@/lib/utils/healthScoreCalculator";

export default function ClientProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [risks,setRisks]=useState<any[]>([])
  const [feedbacks,setFeedbacks]=useState<any[]>([])
  const [checkIns,setCheckIns]=useState<any[]>([])

  useProtectedRoute(setUser,{clientProject:true,setProjects,setRisks,setFeedbacks,setCheckIns},"client",setIsLoading)

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

  const hasProjects = projects && projects.length > 0;

  const getProjectData = (projectId: string) => {
    const projectCheckIns = checkIns.filter(c => c.projectId === projectId);
    const projectRisks = risks.filter(r => r.projectId === projectId);
    const projectFeedbacks = feedbacks.filter(f => f.projectId === projectId);
    return { projectCheckIns, projectRisks, projectFeedbacks };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Projects
        </h1>
        <p className="text-gray-600">
          Monitor your projects and provide feedback to your team.
        </p>
      </div>

      {/* content */}
      {!hasProjects ? (
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardBody className="p-8">
            <EmptyState
              title="No Projects"
              description="You don't have any assigned projects at the moment."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project: any) => {
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

            return (
              <Link
                key={project._id}
               href={{
    pathname: `/client/projects/${project._id}`,
    query:{name:project.name,id:project._id},

  }}
              >
                <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                  <CardBody className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* top section */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${healthBg} ${healthColor}`}>
                          {healthStatus.replace("_"," ").toUpperCase()}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      )}

                      {/* project details grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-2">
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500">Start date</p>
                          <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500">End date</p>
                          <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500">Admin</p>
                          <p>{project.adminName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500">Your email</p>
                          <p className="truncate">{project.clientEmail || user.email}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs font-semibold uppercase text-gray-500">Health Score</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${healthScore}%`,
                                  backgroundColor: healthScore >= 80 ? "#16a34a" : healthScore >= 60 ? "#ca8a04" : "#dc2626"
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{healthScore}%</span>
                          </div>
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
