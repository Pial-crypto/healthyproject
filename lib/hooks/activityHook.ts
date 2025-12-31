"use client"

import { useEffect } from "react";
import { ClientFeedback, EmployeeCheckIn, Project, Risk } from "../types";

export const activityHook=(projects:Project[],checkIns:EmployeeCheckIn[],risks:Risk[],feedbacks:ClientFeedback[],setActivities:any)=>{
      useEffect(() => {
        if (!projects.length) return;
        const projectIds = new Set(projects.map(p => p._id.toString()));
    
        const filteredCheckIns = checkIns.filter(c => projectIds.has(c.projectId));
        const filteredRisks = risks.filter(r => projectIds.has(r.projectId));
        const filteredFeedbacks = feedbacks.filter(f => projectIds.has(f.projectId));
    
        const allActivities = [
          ...filteredCheckIns.map(c => ({ ...c, type: "check_in", timestamp: c.timeStamp })),
          ...filteredRisks.map(r => ({ ...r, type: "risk_created", timestamp: r.timeStamp })),
          ...filteredFeedbacks.map(f => ({ ...f, type: "feedback", timestamp: f.timeStamp })),
          ...projects.map(p => ({ ...p, type: "project_created", timestamp: p.timeStamp })),
        ];
    
        allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(allActivities);
      }, [projects, checkIns, risks, feedbacks]);
}