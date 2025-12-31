"use client"

import { useRouter } from "next/router";
import { createProject, createUser, updateProject } from "../utils/api";
import toast from "react-hot-toast";
import { generateRandomPassword } from "../utils/passWord";

export const updateProjectHook=async (formData:any,projectState:any,removedEmployees:any,initialProject:any,setShowSuccess:any,setIsSubmitting:any,projectId:any,router:any)=>{
  
       try {
    
      console.log("Submitting update for project:", projectId, {
        ...formData,
        employeeList: projectState.employeeList,
        removedEmployees,
      });
  const projectVar = {
       ...initialProject,
       ...formData,
       employeeList: projectState.employeeList,
      };
      const response=await updateProject({projectVar:projectVar})
      if(response.ok){
  

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1500);
    }
      
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsSubmitting(false);
    }
}

export const createProjectHook= async(formData:any,user:any,username:any,setShowSuccess:any,setIsSubmitting:any,router:any)=>{
        try {
      // Create project
      //console.log("Creating project with data:", formData,user);
      const response =await createProject(formData,user)
      console.log(response,"The res ")
      if (!response.ok) {
        toast.error("Failed to create project");
        throw new Error("Failed to create project");
      }

      // Create client user
      const password = generateRandomPassword();
      const createUserResponse = await createUser({
        name: username,
        email: formData.clientEmail,
        password: password,
        role: "client",
        
      });

      if (!createUserResponse.ok) {
        toast.error("Failed to create client user");
        throw new Error("Failed to create client user");
      }

      const userData = await createUserResponse.json();
      console.log("Client user created:", userData);
      
      setShowSuccess(true);
      toast.success("Project created successfully!");
      setTimeout(() => router.push("/admin/projects"), 1500);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
}