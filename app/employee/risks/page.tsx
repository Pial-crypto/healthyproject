"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  LoadingPage,
  EmptyState,
} from "@/app/components";
import Link from "next/link";
import { createRisk, fetchRisk, solveRisk } from "@/lib/utils/api";
import { SkeletonList } from "@/app/components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { Risk } from "@/lib/types";


export default function RisksPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [risks,setRisks]=useState<Risk[]>([]);

  
  useProtectedRoute(setUser,{employeeRisks:true,setRisks},"employee",setIsLoading)
  if (isLoading) return <SkeletonList></SkeletonList>
  if (!user) return null;
const openRisks = risks.filter((r: any) => !r.solved);
const resolvedRisks = risks.filter((r: any) => r.solved);

const markAsSolved = async (riskId: string) => {

  
  const res=await solveRisk(riskId)
  if(res.ok){
        setRisks((prevRisks) =>
    prevRisks.map((risk) => 
      risk._id === riskId
        ? { ...risk, solved: true }  
        : risk
    )
  );
  }
};



  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Risk Management</h1>
        <p className="text-gray-600 text-lg">
          Track and manage project risks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {openRisks.length}
            </div>
            <p className="text-sm text-gray-600">Open Risks</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {openRisks.filter((r) => r.severity === "high").length}
            </div>
            <p className="text-sm text-gray-600">High Severity</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {resolvedRisks.length}
            </div>
            <p className="text-sm text-gray-600">Resolved</p>
          </CardBody>
        </Card>
      </div>

      {/* New Risk Button */}
      <div className="mb-8">
        <Link href="/employee/risks/new">
          <Button>+ Report New Risk</Button>
        </Link>
      </div>

      {/* Open Risks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Risks</h2>
        {openRisks.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                title="No Open Risks"
                description="Great! All identified risks have been resolved"
              />
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {openRisks.map((risk) => (
              <Card key={risk._id} className="border-l-4 border-red-600">
             <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
  <CardBody className="p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        {/* Title & Severity */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {risk.title}
          </h3>
          <span
            className={`text-sm md:text-base font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${
              risk.severity === "high"
                ? "bg-red-100 text-red-800"
                : risk.severity === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {risk.severity.toUpperCase()}
          </span>
        </div>

        {/* Description & Project */}
        <p className="text-base text-gray-700">{risk.description}</p>
        <p className="text-base text-gray-700">
          📁 Project: <span className="font-semibold">{risk.projectName}</span>
        </p>

        {/* Mitigation */}
        <p className="text-base text-gray-700">
          🛡️ <strong>Mitigation:</strong> {risk.mitigationPlan}
        </p>

        {/* Timestamp */}
        <p className="text-sm text-gray-500">
          Created: {new Date(risk.timeStamp).toLocaleDateString()}
        </p>
      </div>

      {/* Solved Toggle */}
      <div className="flex items-center gap-2">
        {!risk.solved ? (
          <Button
            size="sm"
            onClick={() => markAsSolved(risk._id)}
            className="flex items-center gap-1 px-4 py-2 text-green-700 border border-gray-300 rounded-md hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-all duration-300 font-medium text-sm"
          >
            <span>Solved</span>
            <span className="text-lg">❓</span>
          </Button>
        ) : (
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-semibold shadow-sm">
            <span className="text-xl">✅</span>
            <span>SOLVED</span>
          </div>
        )}
      </div>
    </div>
  </CardBody>
</Card>

              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Risks */}
  
      {/* Resolved Risks */}
      {resolvedRisks.length > 0 && (
        <div className="space-y-3 mt-6">
          {resolvedRisks.map((risk) => (
        <Card
  key={risk._id}
  className="border-l-4 border-green-600 bg-green-50/30 rounded-xl shadow-sm hover:shadow-md transition-opacity opacity-90"
>
  <CardBody className="space-y-4 p-5">
    {/* Title & Status */}
    <div className="flex items-center justify-between">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 line-through flex items-center gap-2">
        🟢 {risk.title}
      </h3>
      <span className="text-sm md:text-base bg-green-100 text-green-800 px-3 py-1 rounded font-semibold">
        RESOLVED
      </span>
    </div>

    {/* Description & Severity */}
    <div className="flex items-center justify-between flex-wrap gap-3">
      <p className="text-base md:text-lg text-gray-700 flex-1">{risk.description}</p>
      <span
        className={`text-sm md:text-base font-semibold px-3 py-1 rounded ${
          risk.severity === "high"
            ? "bg-red-100 text-red-800"
            : risk.severity === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {risk.severity.toUpperCase()}
      </span>
    </div>

    {/* Project & Mitigation */}
    <p className="text-base md:text-lg text-gray-600">
      📁 Project: <span className="font-semibold">{risk.projectName}</span>
    </p>
    <p className="text-base md:text-lg text-gray-700">
      🛡️ <strong>Mitigation:</strong> {risk.mitigationPlan}
    </p>

    {/* Timestamp */}
    <p className="text-sm md:text-base text-gray-500">
      Created: {new Date(risk.timeStamp).toLocaleDateString()}
    </p>
  </CardBody>
</Card>

          ))}
        </div>
      )}
    </div>
  );
}
