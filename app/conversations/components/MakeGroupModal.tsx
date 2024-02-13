import { Modal } from "antd";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Input from "../../components/inputs/Input";
import Select from "../../components/inputs/Select";
import Button from "../../components/Button";
import { ModalContext } from "@/app/components/LoadingModal";

interface GroupModalProps {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
  users: User[];
}

const MakeGroupModal = ({ isOpen, setIsOpen, users }: GroupModalProps) => {
  const router = useRouter();
  const { openLM, closeLM } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
      image: "/images/group.png",
    },
  });

  const members = watch("members");
  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result.info.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    openLM();
    setIsLoading(true);

    axios
      .post("/api/conversations", { ...data, isGroup: true })
      .then(() => {
        router.refresh();
        setIsOpen(false);
      })
      .catch(() => toast.error("グループ作成時にエラーが発生しました"))
      .finally(() => {
        setIsLoading(false);
        closeLM();
      });
  };

  return (
    <Modal
      title="グループチャットを作成"
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      width={500}
      footer={null}
    >
      <form id="submit" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 flex flex-col gap-y-8">
              {/* グループアイコン */}
              <div className="mx-auto">
                <div
                  className="
    			relative
                	inline-block 
                	rounded-full 
                	overflow-hidden
			size-28
                	md:h-30
                	md:w-30
			border-2"
                >
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="ivjsicny"
                  >
                    <Image fill src={image} alt="Avatar" />
                  </CldUploadButton>
                </div>
              </div>
              {/* グループ名 */}
              <Input
                disabled={isLoading}
                label="グループ名"
                id="name"
                errors={errors}
                required
                register={register}
              />
              {/* メンバー選択 */}
              <Select
                disabled={isLoading}
                label="友だち"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                  image: user.image,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
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
            グループを作成
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MakeGroupModal;
