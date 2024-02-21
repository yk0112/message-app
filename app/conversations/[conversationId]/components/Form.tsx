"use client";

import { HiPaperAirplane } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import { GrAttachment } from "react-icons/gr";
import toast from "react-hot-toast";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    if (result.info.resourceType != "image") {
      toast.error("画像ファイルのみ送信可能です");
    } else {
      axios.post("/api/messages", {
        image: result.info.secure_url,
        conversationId: conversationId,
      });
    }
  };

  return (
    <div
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      "
    >
      {/* メディアファイルの送信ボタン */}
      <CldUploadButton
        options={{
          maxFiles: 1,
          resourceType: "image",
          singleUploadAutoClose: true,
        }}
        onUpload={handleUpload}
        uploadPreset="ivjsicny"
      >
        <GrAttachment size={25} className="text-green-500" />
      </CldUploadButton>
      {/* メッセージ送信フォーム */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="メッセージを入力"
        />
        <button
          type="submit"
          className="
            rounded-full 
            p-2 
            bg-green-500 
            cursor-pointer 
            hover:opacity-75  
            transition
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
