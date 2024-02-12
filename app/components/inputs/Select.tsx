"use client";

import ReactSelect from "react-select";
import Avatar from "../Avatar";
import Image from "next/image";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  type UserOption = {
    label: string;
    value: number;
    image: string;
  };

  const FormatOptionLabel = ({ option }: { option: UserOption }) => (
    <div className="flex">
      <div
        className="
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9
	mr-2
        md:h-5 
        md:w-5
      "
      >
        <Image
          fill
          src={option.image || "/images/placeholder.jpg"}
          alt="Avatar"
        />
      </div>

      <div className="text-sm">{option.label}</div>
    </div>
  );

  return (
    <div className="z-[100]">
      <label
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          formatOptionLabel={(option) => <FormatOptionLabel option={option} />}
        />
      </div>
    </div>
  );
};

export default Select;
