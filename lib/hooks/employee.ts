"use client"

import { useEffect } from "react";
import { createCheckIn, createRisk, createUser, fetchEmployee, updateProject } from "../utils/api";
import { generateRandomPassword } from "../utils/passWord";
import { checkInForm, Project, RiskForm } from "../types";

export const createEmployeeHook=async (newEmployee:any,setErrors:any,user:any,setProjects:any,setEmployeeList:any,setShowAddForm:any,setNewEmployee:any
    ,setIsSubmitting:any
)=>{
      try {
          const creationResponse = await createUser({
            name: newEmployee.name,
            email: newEmployee.email,
            password: generateRandomPassword(),
            role: "employee",
          });
    
          if (creationResponse.ok) {
            const data = await creationResponse.json();
            if (!data.success) {
              setErrors({ email: data.message || "Employee creation failed" });
            } else {
              for (const projectId of newEmployee.assignedProjects) {
                const res =await updateProject({
                  projectId,
                  employeeEmail: newEmployee.email,
                });
    
                const result = await res.json();
                if (!res.ok) {
                  setErrors({ email: result?.message || "Assign failed" });
                  return;
                }
              }
    
              await fetchEmployee(user,setProjects,setEmployeeList);
    
              setShowAddForm(false);
              setNewEmployee({ name: "", email: "", assignedProjects: [] });
              setErrors({});
            }
          } else {
            const data = await creationResponse.json();
            setErrors({ email: data?.message || "Employee creation failed" });
          }
        } catch (err) {
          setErrors({ email: "Failed to add employee" });
        } finally {
          setIsSubmitting(false);
        }
}


export const initailFormHook=(user:any,projectId:any,setFormData:any)=>{
     useEffect(() => {
        if (user && projectId) {
          const now = new Date();
          const weekNumber = `2025-W${String(
            Math.ceil((now.getDate() + (now.getDay() === 0 ? -6 : now.getDay() - 1)) / 7)
          ).padStart(2, "0")}`;
    
          setFormData((prev:checkInForm) => ({
            ...prev,
            projectId,
            employeeId: user._id || user.id || "",
            week: weekNumber,
          }));
        }
      }, [user, projectId]);
}

export const createCheckInHook=async (formData:any,projectId:any,projectName:any,clientEmail:any,employeeEmail:any,setShowSuccess:any
    ,setErrors:any,setIsSubmitting:any,router:any
)=>{
        try {
     // console.log(formData)
      const res = await createCheckIn({...formData,projectId,projectName,clientEmail,employeeEmail});
     // const response=res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/employee/check-ins");
        }, 1500);
      } else {
        //throw new Error(response.message || "Failed to submit");
      }
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to submit check-in",
      });
    } finally {
      setIsSubmitting(false);
    }
}

export const createRiskHook=async (formData:any,projects:Project[],router:any,user:any,setErrors:any,setIsSubmitting:any)=>{
      try {
      const selectedProject = projects.find(
        (p) => p._id === formData.projectId
      );

   const res=   await createRisk({
        title: formData.title,
        projectId: formData.projectId,
        projectName: selectedProject?.name,
        description: formData.description,
        severity: formData.severity,
        mitigationPlan: formData.mitigationPlan,
        employeeEmail: user.email,
      });
      if(res.ok)router.push("/employee/risks");

      
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create risk",
      });
    } finally {
      setIsSubmitting(false);
    }
}

export const initialRiskHook=(projects:any,formData:any,setFormData:any)=>{
    useEffect(() => {
    if (projects.length > 0 && !formData.projectId) {
      setFormData((prev:RiskForm) => ({
        ...prev,
        projectId: projects[0]._id,
      }));
    }
  }, [projects, formData.projectId]);
}