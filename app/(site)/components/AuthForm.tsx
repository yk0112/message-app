"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Input from "@/app/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import Button from "@/app/components/Button";
import { toast } from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status == "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("エラーが発生しました"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("エラーが発生しました");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("ログインに成功しました");
            router.push("/users");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("エラーが発生しました");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("login!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required={false}
              id="name"
              label="アカウント名"
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required={false}
            id="email"
            label="メールアドレス"
            type="email"
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required={false}
            id="password"
            label="パスワード"
            type="password"
          />
          <div>
            <Button disabled={isLoading} fullwidth type="submit">
              {variant === "LOGIN" ? "ログイン" : "登録"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">または</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-5">
              <AuthSocialButton
                icon={BsGithub}
                name="GitHub"
                onClick={() => socialAction("github")}
              />
            </div>
            <AuthSocialButton
              icon={BsGoogle}
              name="Google"
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {variant === "LOGIN"
              ? "初めてですか？"
              : "アカウントをお持ちですか？"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "アカウント作成" : "ログイン"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
