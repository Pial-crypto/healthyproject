"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Tabs,  } from "@/app/components";
import { SkeletonList } from "@/app/components/Skeleton";
import Link from "next/link";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { calculateHealth, getHealthStatus, getHealthColor, getHealthBgColor } from "@/lib/utils/healthScoreCalculator";

export default function ClientProjectPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id") || "";

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useProtectedRoute(
    setUser,
    { clientProjectDetails: true, setProjects, setCheckIns, setRisks, setFeedbacks },
    "client",
    setIsLoading
  );

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

  const project = projects.find(p => p._id === projectId);
  if (!project) return <p>Project not found</p>;
  console.log(" ",risks,feedbacks,checkIns)

  const projectCheckIns = checkIns.filter(c => c.projectId === project._id);
  const projectRisks = risks.filter(r => r.projectId === project._id);
  const projectFeedbacks = feedbacks.filter(f => f.projectId === project._id);

  const daysElapsed = (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24);
  const totalDays = (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24);
  const avgCompletion = projectCheckIns.length > 0 ? projectCheckIns.reduce((sum, c) => sum + c.completionPercentage, 0) / projectCheckIns.length : 0;
const status={
  "on_track":"On track",
  "at_risk":"At risk",
  "critical":"Critical"
  
}
  const healthScore = calculateHealth({
    clientFeedbacks: projectFeedbacks,
    employeeCheckIns: projectCheckIns,
    risks: projectRisks,
    completionPercentage: avgCompletion,
    daysElapsed,
    totalDays
  });
console.log(projectRisks," ",projectFeedbacks," ",projectCheckIns," ")
  const healthStatus = getHealthStatus(healthScore);

  const tabs = [
    {
      label: "Overview",
      value: "overview",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardBody className="text-center">
                <p className="text-gray-600 text-sm mb-2">Project Health</p>
                <div className="text-3xl font-bold text-green-600">{healthScore}</div>
                {/* <p className="text-xs text-gray-600 mt-1">{healthStatus}</p> */}
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <p className="text-gray-600 text-sm mb-2">Progress</p>
                <div className="text-3xl font-bold text-blue-600">{avgCompletion}%</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <p className="text-gray-600 text-sm mb-2">Status</p>
                <div className="text-lg font-semibold text-blue-600">{status[healthStatus]}</div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">About</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">{project.description}</p>
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      label: "Team Progress",
      value: "progress",
      content: (
        <div className="space-y-4">
          {projectCheckIns.map(checkIn => (
            <Card key={checkIn._id}>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{checkIn.employeeName}</h4>
                    <p className="text-sm text-gray-600">Week {checkIn.week}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{checkIn.completionPercentage}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{checkIn.progressSummary}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${checkIn.completionPercentage}%` }}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
    {
      label: "Risks",
      value: "risks",
      content: (
        <div className="space-y-4">
          {projectRisks.map(risk => (
            <Card key={risk._id}>
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getHealthBgColor(risk.severity)} ${getHealthColor(risk.severity)}`}
                    >
                      {risk.severity.toUpperCase()}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${risk.status === "open" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {risk.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{risk.mitigationPlan}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/client" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        </div>
        <Link
          href={{
            pathname: `/client/feedback/${project._id}`,
            query: { id: project._id, name: project.name },
          }}
        >
          <Button>Give Feedback</Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          <Tabs tabs={tabs} />
        </CardBody>
      </Card>
    </div>
  );
}
