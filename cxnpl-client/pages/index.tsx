import { signIn,signOut,useSession }  from "next-auth/react";
import Link from 'next/link';
import Image from'next/image';

export default function Home() {
  const {data: session, status} = useSession();

  console.log(process.env.NEXTAUTH_URL)

  return (
    <div className="flex h-screen">
      <div className="m-auto text-center text-3xl bold pb-3">
        <Image className="m-auto pb-10" src="/alec.png" alt="alec" width="256" height="256"></Image>
      <h1 className="pb-3">Welcome to Constance - Identity Management System by Constantinople</h1>
      <br/>
      {status === "authenticated" && session && (
        <div className="grid grid-rows-2 gap-5">
          Signed in as: <h2 className="font-bold">{session?.user?.email} </h2><br/>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut( {callbackUrl: `https://cxnpl-client-production.up.railway.app/`})}>Sign out</button>
          {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut( {callbackUrl: `http://127.0.0.1:3000/`})}>Sign out</button> */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/company"> View your company</Link></button>  
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/user_permissions">View your permissions here</Link></button>
        </div>
      )}

      <br/>
      {status === "unauthenticated"  && !session && (
        <div className="grid grid-rows-2 gap-5">
        
          Not signed in
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => signIn()}>Sign in for master users</button>
        </div>
       )}


       </div>
    </div>
    
  );
}
