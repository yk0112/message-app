import { Modal, Button } from "antd";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Avatar from "@/app/components/Avatar";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useRouter } from "next/navigation";

interface settingModalProps {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
  data: Conversation & {
    users: User[];
  };
}

const SettingsModal = ({ isOpen, setIsOpen, data }: settingModalProps) => {
  const otherUser = useOtherUser(data);
  const chatname = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const status = useMemo(() => {
    return "Active";
  }, []);

  return (
    <Modal
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      width={400}
      footer={[
        <Button
          key="back"
          type="text"
          style={{ background: "white", borderColor: "#3cb371" }}
          onClick={() => setIsOpen(false)}
        >
          キャンセル
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ background: "#3cb371", borderColor: "#3cb371" }}
          onClick={() => setIsOpen(false)}
        >
          {"保存"}
        </Button>,
      ]}
    >
      <div className="relative mt-6 flex-1 px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            {/*チャットルームアイコン*/}
            {data.isGroup ? (
              <Avatar conversation={data} />
            ) : (
              <Avatar user={otherUser} />
            )}
          </div>
          <div>{chatname}</div>
          <div className="text-sm text-gray-500">{status}</div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
