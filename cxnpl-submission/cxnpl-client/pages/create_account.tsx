import { signIn,signOut,useSession }  from "next-auth/react";
import {useState, useEffect } from 'react'
import Link from 'next/link'
import { CompanyDataType, UserDataType } from "./company";



export default function Company() {
    const [companyData, setCompanyData] = useState<CompanyDataType>()
    const [userData, setUserData] = useState<UserDataType>()
    const {data: session, status} = useSession();
    const [currRole, setRole] = useState("user");
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [password2, setPassword2] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [company, setCompany] = useState<string>()


    useEffect(() => {
        Promise.all([
            // Move API calls to API folder - time permitting 
            fetch(`https://cxnpl-server-production.up.railway.app/company/${session?.user?.email}`),
            fetch(`https://cxnpl-server-production.up.railway.app/user_info/${session?.user?.email}`)
            // fetch(`http://127.0.0.1:8000/company/${session?.user?.email}`),
            // fetch(`http://127.0.0.1:8000/user_info/${session?.user?.email}`)
        ])
        .then(([resCompanies, resUsers]) => 
            Promise.all([resCompanies.json(), resUsers.json()])
        )
        .then (([dataCompanies, dataUsers]) => {
            setCompanyData(dataCompanies)
            setUserData(dataUsers)
            setCompany(dataCompanies.company_readable_id)
            // console.log(dataCompanies)
            // console.log(dataUsers)
        })
    }, [session?.user?.email])

    const handleSubmit = async (event:any) => {
        // Prevents the form from submitting and refreshing the page
        event.preventDefault()

        const data = {
            username: username,
            password:password,
            password2: password2,
            email: email,
            company: company,
            role: currRole,
        }
        const JSONdata = JSON.stringify(data)

        // const endpoint = `http://127.0.0.1:8000/accounts/register`
        const endpoint = `https://cxnpl-server-production.up.railway.app/accounts/register`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSONdata,
        }
        console.log(data)

        const response = await fetch(endpoint, options)
        .then( response => {
            if (!response.ok) {
                alert("There was an error in account creation")
            } else {
                alert("User created successfully")
            }
        })
    }



    if (userData?.role ==="user") return (<div>
        You are a base user and therefore unable to create other users.
        <Link href="/"><button >Click here to return to dashboard</button></Link>
    </div>)

    return (
        <>
        <div className="">
        <div className="flex h-screen ">
            <div className="m-auto w-full max-w-xs ">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h1 className="text-center">Create a user account in the company: </h1> 
                    <h1 className="font-bold text-center">{userData?.company}</h1>
                    <h1 className="text-center pb-10">for which you are a {userData?.role}.</h1>
                    <h1 className="text-center">As a company {userData?.role}, you can create:</h1>
                        <ul>
                            <div className="font-bold text-center">

                        {(userData?.role === "owner" || userData?.role === "company_admin") && session && (
                            <div className="">A user</div>
                            
                            )}
                        <div className="">
                            {userData?.role === "owner" && session && (
                            <>
                            <div>An administrator</div>
                            <div>An owner</div>
                            </>
                            )}
                            </div>
                            </div>
                        </ul>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_id">
                    Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={(e) => setPassword(e.target.value)} type="text"/>
                    <p className="text-red-500 text-xs italic">Refer to docs for all validation rules</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
                    Confirm Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
                    Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
                    Company(Default)
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" readOnly ={true} defaultValue={companyData?.company_readable_id} onChange={(e) => setCompany(e.target.value)}/>
                    <p className="text-red-500 text-xs italic">Your company: {companyData?.company_readable_id} is the default</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
                    Role
                    </label>
                    <select value = {currRole} id="role" onChange = {(e) => {
                setRole(e.target.value);
            }} className="bg-blue-500 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option >Choose a user type</option>
            {(userData?.role === "owner" || userData?.role === "company_admin") && session && (
                <option value="user">User</option>
                
            )}
            {(userData?.role === "owner") && session && (
                <>
                <option value="owner">Owner</option>
                <option value="company_admin">Admin</option>
                </>
        
        )}
            </select>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={handleSubmit}>
                    Create user account
                    </button>
                </div>
            </form>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/company">Back to company</Link></button>
        </div>

      </div>
        </div>
    </>
    )


}

