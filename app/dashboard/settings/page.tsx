import { auth } from "../../../auth"; 
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();  
  if (!session?.user) {
    redirect("/login"); 
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg text-gray-900">{session.user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email Address</label>
            <p className="text-lg text-gray-900">{session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}