import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <nav className="bg-blackD  px-4 lg:px-6 py-6  ">
      <div className="flex flex-col  gap-4  md:gap-2 md:flex-row  justify-between items-center  mx-auto max-w-screen-xl">
        <div className="flex flex-col  gap-4   md:flex-row items-center  gap-x-[60px]">
          <Link
            href={"#"}
            className="font-normal  text-[16px] leading-[24px] text-white"
          >
            Like when2meet?
          </Link>

          <button
            type="button"
            className="text-white bg-gray-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Donate
          </button>
        </div>

        <div className="flex flex-col  gap-4   md:flex-row items-center  gap-x-[60px] ">
          <p className="font-normal  text-white text-[16px] text-center">
            When2meet is a free service. We do not ask for contact or billing
            information. The below is a third-party advertisement.
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
