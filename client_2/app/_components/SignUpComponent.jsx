"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"
import axios from "axios";
import { useAuthStore } from "../zustand/useAuthStore";

export default function SignUpComponent(){

    const router=useRouter();

    const {authName,updateAuthName}=useAuthStore();
    const [username,setUserName]=useState("")
    const [password,setPassword]=useState("");

    const loginFunction=async(e)=>{
        e.preventDefault();

        try{
            const response=await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/auth/signin`,
            {username:username,password:password},{withCredentials:true})
            console.log(response)
            updateAuthName(username)
            router.push("/chat")
        }catch(error){
            console.log("Something went wrong while Login",error);
        }
    }

    const signupFunction=async(e)=>{

        console.log("SignupFunction Reached")
        e.preventDefault();

        try{

            const response=await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/auth/signup`,
            {username:username,password:password},{withCredentials:true})
            console.log(response)

            if(response.data.message==="User Already Exists"){
                alert("User Already Exists")
            }else{
                updateAuthName(username)
                router.push("/chat")
            }

        }catch(error){
            console.log("Error While Signup",error)
        }
    }

    return (

 <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
        <div className="mt-2">
          <input id="username" name="username" type="text"  onChange={(e)=>setUserName(e.target.value)}required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
        </div>
        <div className="mt-2">
          <input id="password" name="password" type="password" onChange={(e)=>setPassword(e.target.value)}  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

        <div className="flex justify-between space-x-4">
                <button type="submit"  onClick={signupFunction}className="flex w-full justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                <button type="submit" onClick={loginFunction}className="flex w-full justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
     
    </form>

   
  </div>
</div>
    )
}