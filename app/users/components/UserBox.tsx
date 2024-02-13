import axios from "axios";
import { useCallback, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import { ModalContext } from "@/app/components/LoadingModal";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const { openLM, closeLM } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    openLM();
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: data.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => {
        setIsLoading(false);
        closeLM();
      });
  }, [data, router]);

  return (
    <div
      onClick={handleClick}
      className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
