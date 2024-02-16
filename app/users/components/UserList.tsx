"use client";

import { User } from "@prisma/client";

import UserBox from "./UserBox";
import { useEffect, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  const [users, setUsers] = useState(items);

  useEffect(() => {
    pusherClient.subscribe("activeChannel");

    const updateHandler = (data: { email: string; isLogin: boolean }) => {
      setUsers((current: User) =>
        current.map((currentUser: User) => {
          if (currentUser.email === data.email) {
            return {
              ...currentUser,
              isLogin: data.isLogin,
            };
          }

          return currentUser;
        }),
      );
    };
    pusherClient.bind("active:update", updateHandler);

    return () => {
      pusherClient.unsubscribe("activeChannel");
      pusherClient.unbind("active:update", updateHandler);
    };
  }, [users]);

  return (
    <aside
      className="
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200
        block w-full left-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div
            className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            "
          >
            People
          </div>
        </div>
        {users.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
