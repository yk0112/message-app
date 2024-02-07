import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function UsersLayout({ children }: LayoutProps) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
