import { Modal } from "antd";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useContext, useMemo, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";
import { ModalContext } from "@/app/components/LoadingModal";

interface settingModalProps {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
  user: User;
}

const SettingsModal = ({ isOpen, setIsOpen, user }: settingModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { openLM, closeLM } = useContext(ModalContext);

  const status = useMemo(() => {
    return "Active";
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: user?.name,
      image: user?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    const url = result.info.secure_url;
    const imageExtensions: string[] = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "svg",
    ];
    const extension: string = url.split(".").pop()?.toLowerCase() || "";

    if (!imageExtensions.includes(extension)) {
      toast.error("画像ファイルのみ送信可能です");
    } else {
      setValue("image", result.info.secure_url, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    openLM();
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        setIsOpen(false);
      })
      .catch(() => toast.error("更新時にエラーが発生しました"))
      .finally(() => {
        setIsLoading(false);
        closeLM();
      });
  };

  return (
    <Modal
      title="プロフィール"
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      width={500}
      footer={null}
    >
      <form id="submit" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex-1 px-4 sm:px-6 border-b border-gray-900/10 pb-5">
          <div className="flex">
            {/* ログイン中のアバター*/}
            <div className="my-10">
              <div
                className="
    		relative 
                inline-block 
                rounded-full 
                overflow-hidden
                h-16 
                w-16 
                md:h-20 
                md:w-20
		border-2
               "
              >
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="ivjsicny"
                >
                  <Image
                    fill
                    src={image || "/images/placeholder.jpg"}
                    alt="Avatar"
                  />
                </CldUploadButton>
              </div>
            </div>

            <div>
              　{/* 名前の表示, 変更フォーム*/}
              <div className="flex m-3">
                <label className="text-base text-gray-800 ml-3 mr-6 my-3">
                  名前
                </label>
                <Input
                  disabled={isLoading}
                  label=""
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
              </div>
              {/* メールアドレス*/}
              <div className="flex m-3">
                <label className="text-base text-gray-800 mx-3">メール</label>
                <div className="text-base text-gray-500">{user.email}</div>
              </div>
              {/* ユーザID */}
              <div className="flex m-3">
                <label className="text-base text-gray-800 ml-3 mr-11">ID</label>
                <div className="text-base text-gray-500">{user.id}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
        >
          <Button
            disabled={isLoading}
            secondary
            onClick={() => setIsOpen(false)}
          >
            キャンセル
          </Button>
          <Button disabled={isLoading} type="submit">
            保存
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
