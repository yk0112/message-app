"use client";

import { Dropdown, Modal, Menu, Button } from "antd";
import { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { MdHideSource } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { Conversation, User } from "@prisma/client";
import SettingsModal from "./SettingModal";
import DeleteModal from "./DeleteModal";

interface LayoutProps {
  children: React.ReactNode;
  data: Conversation & {
    users: User[];
  };
}

const ConversationBoxLayout = ({ children, data }: LayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState({
    hidden: false,
    exit: false,
    notification: false,
  });

  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const showModal = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  const handleOk = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleCancel = (key: string) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const ContextMenu = (
    <Menu
      onClick={({ key }) => {
        if (key == "edit") setIsOpenEdit(true);
        else if (key == "delete") setIsOpenDelete(true);
        else {
          showModal(key);
        }
      }}
      items={[
        { label: "非表示", key: "hidden", icon: <MdHideSource /> },
        { label: "トークを削除", key: "delete", icon: <MdDeleteOutline /> },
        { label: "グループを編集", key: "edit", icon: <MdOutlineEdit /> },
        { label: "トークから退会", key: "exit", icon: <ImExit /> },
        {
          label: "通知オフ",
          key: "notification",
          icon: <IoIosNotificationsOutline />,
        },
      ]}
    ></Menu>
  );

  return (
    <div>
      <Dropdown overlay={ContextMenu} trigger={["contextMenu"]}>
        {children}
      </Dropdown>
      <Modal
        open={isModalOpen.hidden}
        onOk={() => handleOk("hidden")}
        onCancel={() => handleCancel("hidden")}
        width={400}
        footer={[
          <Button
            key="back"
            type="text"
            style={{ background: "white", borderColor: "#3cb371" }}
            onClick={() => handleCancel("hidden")}
          >
            キャンセル
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ background: "#3cb371", borderColor: "#3cb371" }}
            onClick={() => handleOk("hidden")}
          >
            {"非表示"}
          </Button>,
        ]}
      >
        <p>トークルームを非表示にしてよろしいですか？</p>
      </Modal>
      <Modal
        open={isModalOpen.hidden}
        onOk={() => handleOk("hidden")}
        onCancel={() => handleCancel("hidden")}
        width={400}
        footer={[
          <Button
            key="back"
            type="text"
            style={{ background: "white", borderColor: "#3cb371" }}
            onClick={() => handleCancel("hidden")}
          >
            キャンセル
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ background: "#3cb371", borderColor: "#3cb371" }}
            onClick={() => handleOk("hidden")}
          >
            {"退会"}
          </Button>,
        ]}
      >
        <p>このトークルームから退会しますか？</p>
      </Modal>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        data={data}
      />
      <SettingsModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        data={data}
      />
    </div>
  );
};

export default ConversationBoxLayout;
