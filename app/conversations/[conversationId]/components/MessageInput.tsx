"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  register,
}) => {
  return (
    <div className="relative w-full">
      {/* メッセージ入力フィールド */}
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required: true })}
        placeholder={placeholder}
        className="
          text-black
          font-light
          py-2
          px-4
          bg-neutral-100 
          w-full 
          rounded-md
          focus:outline-none
        "
      />
    </div>
  );
};

export default MessageInput;
