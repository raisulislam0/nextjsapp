import { fetchUsersAction } from "@/actions";
import AddNewUser from "@/components/add-new-user";
import SingleUserCard from "@/components/single-user-card";
import Footer from "@/components/footer"; 
import Navbar from "@/components/nav"; 


export default async function UserManagement() {
  const getListOfUsers = await fetchUsersAction();

  return (
    <div className="flex flex-col min-h-screen">
    
      <Navbar />

      <div className="flex-grow p-20 max-w-6xl mx-auto">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl px-1">A List of Users</h1>
          <AddNewUser />
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {getListOfUsers && getListOfUsers.data && getListOfUsers.data.length > 0 ? (
            getListOfUsers.data.map((userItem) => (
              <SingleUserCard key={userItem.id} user={userItem} />
            ))
          ) : (
            <h3>No users found! Please create one</h3>
          )}
        </div>
      </div>

      
      <Footer />
    </div>
  );
}
