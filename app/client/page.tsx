"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardBody, Button, LoadingPage, EmptyState } from "@/app/components";
import Link from "next/link";
import { MessageSquare, Star, AlertTriangle, CalendarDays } from "lucide-react";
import { SkeletonList } from "../components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";




export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  //console.log(user,"dsfafasdfsad")

  



useProtectedRoute(setUser,{clientHome:true,setFeedbacks,setProjects},"client",setIsLoading)

  if (isLoading) return <SkeletonList></SkeletonList>
  if (!user) return null;

 // console.log("Projects:", projects);
  const flaggedFeedback = feedbacks.filter((f) => f.flaggedIssue);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 text-lg">Monitor your projects and provide feedback</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            <p className="text-sm text-gray-600">Assigned Projects</p>
          </CardBody>
        </Card>
    
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-red-600">{flaggedFeedback.length}</div>
            <p className="text-sm text-gray-600">Flagged Issues</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-green-600">{feedbacks.length}</div>
            <p className="text-sm text-gray-600">Feedback Submitted</p>
          </CardBody>
        </Card>
      </div>

       <div>
        <h2 className="text-2xl font-bold mb-4">Recently Assigned</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.slice(0,4).map((project) => (
            // <Link key={project._id} href={`/client/projects/${project._id}`}>
              <Card key={project._id} hover className="shadow-sm transition-transform hover:shadow-md">
                <CardBody>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </CardBody>
              </Card>
    
          ))}
        </div>
      </div>

      <div className="h-2"></div>
        <div className="h-2"></div>


      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Feedback</h2>
        {feedbacks.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                title="No Feedback Yet"
                description="Submit your first weekly feedback"
              />
            </CardBody>
          </Card>
        ) : (
          feedbacks.slice(0,4).map((feedback) => (<div>
        <CardBody className="space-y-6 p-6 bg-white shadow-xl rounded-2xl">

  {/* Project Header */}
  <div className="flex items-center justify-between gap-5">
    <div className="flex items-center gap-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-extrabold">
        {"📁"}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">
          {projects.find((p) => p._id === feedback.projectId)?.name || "Unknown Project"} 🚀
        </h3>
        <p className="flex items-center gap-2 text-base text-gray-500">
          <CalendarDays className="h-5 w-5 text-gray-400" />
          {new Date(feedback.timeStamp).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div>
 
    </div>
  </div>

  {/* Comment Section */}
  <p className="text-xl text-gray-800 font-semibold">
    💬 {feedback.comment || "No comment provided."}
  </p>

  {/* Ratings */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-lg">
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 text-base font-medium text-emerald-700">
        ⭐ Satisfaction
      </span>
      <span className="text-gray-900 font-bold text-2xl">
        {feedback.satisfactionRating}/5
      </span>
    </div>
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-base font-medium text-indigo-700">
        💬 Communication
      </span>
      <span className="text-gray-900 font-bold text-2xl">
        {feedback.communicationClarity}/5
      </span>
    </div>
  </div>

  {/* Issue Section */}
  <div className="mt-4">
    <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
      ⚠️ Reported Issue
    </p>
    {feedback.issueDescription ? (
      <div className="flex items-center gap-4 rounded-2xl bg-amber-50 px-6 py-3 text-lg text-amber-800 border border-amber-200 shadow-sm">
        <span className="text-3xl">🚨</span>
        <span className="font-semibold text-gray-900">
          {feedback.issueDescription}
        </span>
      </div>
    ) : (
      <p className="text-lg text-gray-500 font-semibold flex items-center gap-2">
        ✅ No issue reported
      </p>
    )}
  </div>
</CardBody>
<div className="h-2"/>
<div className="h-2"/>
</div>

          ))
        )}
      </div>

   
    </div>
  );
}
