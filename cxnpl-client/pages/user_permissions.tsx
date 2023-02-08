import { signIn,signOut,useSession }  from "next-auth/react";
import Link from "next/link";
import {useState, useEffect } from 'react'
import { UserDataType } from "./company";

export default function Company() {
    const [data, setData] = useState<UserDataType>();
    const {data: session, status} = useSession();
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [menuActive, setMenuActive] = useState({
        status: false,
        key:""
    });

    useEffect(() => {
        fetch(`https://cxnpl-server-production.up.railway.app/user_info/${session!!.user?.email}`)
        // fetch(`http://127.0.0.1:8000/user_info/${session!!.user?.email}`)
        .then((res) => res.json())
        .then ((data) => {
            setData(data)
            console.log(data)
            setUserPermissions(data.user_permissions)
        })
    }, [session?.user])

    const handleToggle = (key:any) => {
        if(menuActive.key === key) {
          setMenuActive({
            status: false,
            key: ""
          });
        } else {
          setMenuActive({
            status: true,
            key
          });
        }
      }


    if (!data) return <p> No company data</p>

    return (
        <>
        <div className=" h-screen grid grid-rows-5">
            <table className="table-auto m-auto row-start-2 text-2xl bold pb-5 border-separate border-spacing-2 border border-gray-300 bg-white px-8 py-4 font-medium text-gray-700 shadow-sm">
                <tbody>
                    <tr className="border border-slate-600 border-b">
                        <td className="border-r">Authentication</td>
                        <td>{status}</td>
                    </tr>
                    <tr>
                        <td className="border-r">Username</td>
                        <td>{data.username}</td>
                    </tr>
                    <tr>
                        <td className="border-r">Company</td>
                        <td>{data.company}</td>
                    </tr>
                    <tr>
                        <td className="border-r">Role: </td>
                        <td>{data.role}</td>
                    </tr>
                </tbody>
            </table>

            {status === "authenticated" && session && (
                    <div className="pl-64 m-auto row-start-1 justify-self-center ">
                        <div className="grid grid-cols-4 gap-4">
                            <p className="col-start-2 col-end-3">
                            Signed in as {session?.user?.email} <br/>
                            </p>
                        {/* <button onClick={() => signOut( {callbackUrl: `https://cxnpl-client-production.up.railway.app/`})}>Sign out</button> */}
                            <button className=" col-start-2 col-end-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut( {callbackUrl: `http://127.0.0.1:3000`})}>Sign out</button>
                            <br/>
                            <button className="col-start-2 col-end-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/">Back to dashboard</Link></button>
                        </div>
                    </div>
                )}


            <div className="m-auto inline-block text-left border-red-50 row-start-3 pt-20 ">
                <div>
                    <button onClick={() => handleToggle("client")} className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-8 py-4 text-xl font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseWithScrollbar">
                    Your Permissions
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                    </button>
                </div>

                <div className={`${menuActive.key == 'client' ? 'collapse':''} z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-48 overflow-y-auto`} id="collapseWithScrollbar" >
                    <div className="py-1 " role="none">
                                {userPermissions!!.map((permission:string, index:number) =>(
                                    <ul key = {index}>
                                        <>
                                        <label className="text-gray-700 block w-full px-4 py-2 text-left text-sm" id="menu-item">{permission}</label>
                                        </>
                                    </ul>
                                ))}
                    </div>
                </div>
        </div>


                    </div>


    </>
    )


}

