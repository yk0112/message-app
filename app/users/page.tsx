"use client";
import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import axios from "axios";
import { useSession } from "next-auth/react";

const Users = () => {
  const session = useSession();

  useEffect(() => {
    axios.post("api/active", { login: true });
  }, [session]);

  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Users;
