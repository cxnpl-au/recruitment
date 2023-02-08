import { signIn,signOut,useSession }  from "next-auth/react";
import {useState, useEffect } from 'react'
import Link from 'next/link'

export type UserDataType = {
    username:string;
    company:string;
    role:string;
    is_company_admin:boolean;
    user_permissions:string[];
}


export type CompanyDataType = {
    account_funds:string;
    company_readable_id:string;
    owner:string;
    company_name:string;
}

export default function Company() {
    const [companyData, setCompanyData] = useState<CompanyDataType>()
    const [userData, setUserData] = useState<UserDataType>()
    const [companyNameData, setCompanyNameData] = useState<string>()
    const [companyReadableID, setCompanyReadableID] = useState<string>()
    const [owner, setOwner] = useState<string>()
    const [newState, setNewState] = useState(false)

    const {data: session, status} = useSession();
    const [allUserData, setAllUserData] = useState<string[]>()
    const [fetched, setFetched] = useState(false)


    useEffect(() => {
        Promise.all([
            // To Do - Future
            // Move API calls to API folder which will allow for cleaner code and
            // separation of client and api logic
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
            setAllUserData(dataCompanies.all_users)
            setOwner(dataUsers.username)
        })
    }, [session?.user,newState])

    const handleDeleteUser = async (currUser:string) => {

        const data = {
            user: currUser,
        }
        const JSONdata = JSON.stringify(data)
        // const endpoint = `http://127.0.0.1:8000/accounts/delete`
        const endpoint = `https://cxnpl-server-production.up.railway.app/accounts/delete`

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSONdata,
        }

        const response = await fetch(endpoint, options)
        if (response.status === 200) {
            setNewState(true)
        }
        alert("User deleted")
        console.log(response)

    }

    // Handles logic to create a company and assign the creater as the owner
    const handleSubmit = async (event:any) => {
        // Prevents the form from submitting and refreshing the page
        event.preventDefault()

        const data = {
            company_name:companyNameData,
            company_readable_id:companyReadableID,
            owner:owner,
        }
        console.log(data)
        const JSONdata = JSON.stringify(data)

        const endpoint = `https://cxnpl-server-production.up.railway.app/company/create`
        // const endpoint = `http://127.0.0.1:8000/company/create`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSONdata,
        }

        const response = await fetch(endpoint, options)

        const result = await response.json()
        if (response.status === 200) {
            setNewState(true)
        }
        alert("Company created successfully")

    }

    // Client authorization - If a user is not authorized OR does not belong to a 
    // company, this renders to allow company of creation.
    // Company creation should only be available to master users which should be 
    // implemented server-side. 
    // Users that create a company default to its owner and the user's company is set
    // to the created company

    if (companyData && companyData.company_name === "No Company") return (
        <>
        <div className="flex h-screen ">
            <div className="m-auto w-full max-w-xs ">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                No company data, fill out this form to create a company:
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                    Company Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={companyNameData} onChange={(e) => setCompanyNameData(e.target.value)} type="text"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_id">
                    Company ID
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={companyReadableID} onChange={(e) => setCompanyReadableID(e.target.value)} type="text"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
                    Owner
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" defaultValue={userData!!.username} onChange={(e) => setOwner(e.target.value)}/>
                    <p className="text-red-500 text-xs italic">You are the default owner</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={handleSubmit}>
                    Create Company
                    </button>
                </div>
                </form>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/">Back to dashboard</Link></button>
        </div>

      </div>
        </>
        ) 
        
        return (
            <>
        <div className="flex h-screen">
            <div className="m-auto text-center text-3xl bold">
                <h1 className="font-bold">Authentication status:</h1>
                <h1 className="font-bold">{status}</h1> 
                <h2 className="font-bold">Username: </h2>{userData?.username}
                <h2 className="font-bold">Company: </h2>{userData?.company}
                <h2 className="font-bold">Role: </h2>{userData?.role}
                <h2 className="font-bold">Bank funds: </h2>{companyData?.account_funds}
                <br/>

            <div className="m-auto text-center">
                {/* Only company owners and admins will be allowed to create a user  */}
                {/* Currently this is client security only, however this should be 
                implemented server-side to improve security */}
                {(userData?.role === "owner" || userData?.role === "company_admin") && session && (
                    <Link href="/create_account"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create accounts for employees</button></Link>
                    )}

            </div>
            <br/>
    {/* Lists out all employees in a users current company. Owners and company administrators
    should be able to delete users */}


    <div>Here is a list of all employees in your organization:
        <ul className="list-decimal list-outside">
            {allUserData?.map((currUser, index) =>(
                <li key = {index}>
                {(userData?.role === "owner" || userData?.role === "company_admin") && session && (
                    <>
                    <label>{currUser}</label>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteUser(currUser)} type="submit">Delete User</button>
                    </>
                )}
                </li>
            ))}
        </ul>
    </div>
    
    
    
    <br/>
    
        {status === "authenticated" && session && (
            <div className="m-auto text-center grid grid-rows-2 gap-3">
                Signed in as {session?.user?.email} <br/>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut( {callbackUrl: `https://cxnpl-client-production.up.railway.app/`})}>Sign out</button>
                {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut( {callbackUrl: `http://127.0.0.1:3000/`})}>Sign out</button> */}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/">Back to dashboard</Link></button>
            </div>
        )}
    </div>
    </div>
    </>
    )

    
}

