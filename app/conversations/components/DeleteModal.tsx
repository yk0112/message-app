import { Modal, Button } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { Conversation, User } from "@prisma/client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ModalContext } from "@/app/components/LoadingModal";

interface settingModalProps {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
  data: Conversation & {
    users: User[];
  };
}

const DeleteModal = ({ isOpen, setIsOpen, data }: settingModalProps) => {
  const router = useRouter();
  const { openLM, closeLM } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    openLM();

    axios
      .delete(`/api/conversations/${data.id}`)
      .then(() => {
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => {
        setIsLoading(false);
        closeLM();
        setIsOpen(false);
      });
  }, [router, data]);

  return (
    <Modal
      open={isOpen}
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
          onClick={onDelete}
        >
          {"削除"}
        </Button>,
      ]}
    >
      <p>このトークルームを削除してよろしいですか？</p>
    </Modal>
  );
};

export default DeleteModal;
