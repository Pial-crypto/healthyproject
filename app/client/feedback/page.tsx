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
import { fetchFeedback, fetchProjects } from "@/lib/utils/api";
import { AlertTriangle, CalendarDays, Star } from "lucide-react";
import { SkeletonList } from "@/app/components/Skeleton";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";

export default function FeedbackList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);


  useProtectedRoute(setUser,{clientFeedback:true,setProjects,setFeedbacks},"client",setIsLoading)

  if (isLoading) return <SkeletonList></SkeletonList>
  if (!user) return null;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Keep Updated
        </h1>
        <p className="text-gray-600 text-lg">
          Share your feedback on project progress and team communication.
        </p>
      </div>

      {/* content */}
      {projects.length === 0 ? (
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardBody className="p-8">
            <EmptyState
              title="No projects available"
              description="You currently have no active projects to give feedback on."
            />
          </CardBody>
        </Card>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Submit Feedback
          </h2>
          <div className="space-y-3">
            {projects.map((project: any) => (
              <div key={project._id}>
           <Link key={project._id}
  href={{
    pathname: `/client/feedback/${project._id}`,
    query:{name:project.name,id:project._id},

  }}
>
     <Card className="hover:shadow-xl transition-shadow cursor-pointer rounded-2xl border border-gray-200">
  <CardBody className="p-5">
    <div className="flex items-center justify-between gap-4">
      
      {/* Project Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl font-bold">
          📁
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {project.name} 🚀
          </h3>
          <p className="text-base text-gray-600 line-clamp-2">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        size="lg"
        className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md px-5 py-2 text-lg font-semibold transition-all"
      >
        ✨ New Feedback
      </Button>
    </div>
  </CardBody>
</Card>

              </Link>
              <div className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

<div className="h-2"></div>
<div className="h-2"></div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Feedbacks History</h2>
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
          feedbacks.map((feedback) => (
            <Card key={feedback._id} className="mb-3 shadow-sm">
       

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
      <span className="bg-green-100 text-green-800 px-5 py-2 rounded-full text-base font-semibold animate-pulse">
        ✨ New Feedback
      </span>
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


            </Card>
          ))
        )}
      </div>
    </div>
  );
}
