// User types
export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
}



export interface Project {
  _id: string;
  name: string;
  description: string;
  clientEmail: string;
  employeeList: string[];
  startDate: string;
  endDate: string;
  adminId: string;
  adminName: string;
  timeStamp: string;
}

export interface CookieUser {
  name:String,
  role:String,
  email:String,
  id:String
}
export interface RiskForm{
      projectId: String,
    title: String,
    severity: String,
    description:String,
    mitigationPlan:String,
}
export interface checkInForm{
   projectId:String,
    employeeId: String,
    week: String,
    progressSummary: String,
    blockers: String,
    confidenceLevel: String,
    completionPercentage: String,
}


export interface EmployeeCheckIn {
  _id: string;
  employeeEmail: string;
  projectId: string;
  projectName: string;
  week: string;
  completionPercentage: number; // 0-100
  confidenceLevel: number; // 1-5
  progressSummary: string;
  blockers: string;
  clientEmail: string;
  timeStamp: string;
}

export enum RiskSeverity {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface Risk {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  employeeEmail?: string;
  mitigationPlan: string;
  severity: RiskSeverity | string;
  solved: boolean;
  status?: "open" | "closed"; 
  timeStamp: string;
}

export interface ClientFeedback {
  _id: string;
  projectId: string;
  clientId: string;
  satisfactionRating: number; // 1-5
  communicationClarity: number; // 1-5
  comment: string;
  flaggedIssue: boolean;
  issueDescription?: string;
  timeStamp: string;
}
