"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardBody,
  EmptyState,
  Button
} from "@/app/components";
import { SkeletonList } from "@/app/components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import { motion } from "framer-motion";
import { RiskColumn } from "@/app/components/RiskColumn";
import { Project, Risk } from "@/lib/types";


export default function AdminRisksPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
 const [projects, setProjects] = useState<Project[]>([]);


  // Modal state
  const [selectedRisk, setSelectedRisk] = useState<any>(null);

  // Protected route hook
  useProtectedRoute(
    setUser,
    { adminRisk: true, setProjects, setRisks },
    "admin",
    setIsLoading
  );

  if (isLoading) return <SkeletonList />;
  if (!user) return null;

  const projectMap: Record<string, boolean> = {};
  projects.forEach((project) => {
    projectMap[project._id.toString()] = true;
  });

  const criticalRisks = risks.filter((r) => r.severity === "high" && projectMap[r.projectId]);
  const mediumRisks = risks.filter((r) => r.severity === "medium" && projectMap[r.projectId]);
  const lowRisks = risks.filter((r) => r.severity === "low" && projectMap[r.projectId]);

  const closeModal = () => setSelectedRisk(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-gray-900">Risk Management</h1>
        <p className="text-gray-600">Monitor and track all project risks across the organization</p>
      </div>

      {/* Stats */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Total Risks */}
  <Card>
    <CardBody className=" flex flex-col items-center justify-center py-8 text-center">
      <div className="h-14 w-14 ml-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
        Σ
      </div>
      <p className="mt-2 text-sm text-gray-500">Total Risks</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{risks.length}</p>
    </CardBody>
  </Card>

  {/* High Severity */}
  <Card>
    <CardBody className="flex flex-col items-center justify-center py-8 text-center">
      <div className=" ml-3  h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-2xl">
        !
      </div>
      <p className="mt-3 text-sm text-gray-500">High Severity</p>
      <p className="mt-1 text-3xl font-bold text-red-600">{criticalRisks.length}</p>
    </CardBody>
  </Card>

  {/* Open Risks */}
  <Card>
    <CardBody className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-14 ml-3 w-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-2xl">
        ⏳
      </div>
      <p className="mt-3 text-sm text-gray-500">Open Risks</p>
      <p className="mt-1 text-3xl font-bold text-yellow-600">{risks.filter((r) => !r.solved).length}</p>
    </CardBody>
  </Card>
</div>






      {/* Critical Alert */}
      {criticalRisks.length > 0 && (
        <div className="flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-red-600 text-xl">⚠</div>
          <div>
            <h3 className="font-semibold text-red-900">{criticalRisks.length} Critical Risk(s) Require Immediate Action</h3>
            <p className="text-sm text-red-700">These risks are high severity and must be reviewed urgently.</p>
          </div>
        </div>
      )}

      {/* Risks Columns */}
      {risks.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              title="No Risks Reported"
              description="No risks have been reported for any projects yet."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskColumn title="Critical" count={criticalRisks.length} color="red" risks={criticalRisks} onViewDetails={setSelectedRisk} />
          <RiskColumn title="Medium" count={mediumRisks.length} color="yellow" risks={mediumRisks} onViewDetails={setSelectedRisk} />
          <RiskColumn title="Low" count={lowRisks.length} color="green" risks={lowRisks} onViewDetails={setSelectedRisk} />
        </div>
      )}

      {/* Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900" onClick={closeModal}>✕</button>
            <h2 className="text-xl font-semibold mb-2">{selectedRisk.title}</h2>
            <p className="text-sm text-gray-600 mb-2"><strong>Project:</strong> {selectedRisk.projectName}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Description:</strong> {selectedRisk.description || "—"}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Employee:</strong> {selectedRisk.employeeEmail}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Severity:</strong> {selectedRisk.severity}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Mitigation:</strong> {selectedRisk.mitigationPlan}</p>
            <p className="text-sm text-gray-600"><strong>Solved:</strong> {selectedRisk.solved ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
