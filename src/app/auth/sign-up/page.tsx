import Signin from "@/components/Auth/Signin";
import SigninWithPassword from "@/components/Auth/SigninWithPassword";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign Up",
};

export default function SignIn() {
    return (
        <>
            {/* <Breadcrumb pageName="Sign In" /> */}
            <div className="mb-6 mt-6 flex flex-col gap-3 justify-center items-center sm:flex-row sm:items-center sm:justify-center">
                <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                    Sign Up
                </h2>
            </div>

            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full xl:w-1/2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-15">
                            <>
                                {/* <GoogleSigninButton text="Sign in" /> */}

                                <div className="my-6 flex items-center justify-center">
                                    <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
                                    <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
                                        Sign up with email
                                    </div>
                                    <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
                                </div>

                                <div>
                                    <SigninWithPassword signIn={false} />
                                </div>

                                <div className="mt-6 text-center">
                                    <p>
                                        You have any account?{" "}
                                        <Link href="/auth/sign-in" className="text-primary">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </>
                        </div>
                    </div>

                    {/* <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Sign in to your account
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome Back!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Please sign in to your account by completing the necessary
                fields below
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div> */}
                </div>
            </div>
        </>
    );
}
