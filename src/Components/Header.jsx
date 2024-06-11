import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/when2meetlogo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-30">
      <nav className="bg-blackD  px-20  py-6  ">
        <div className="flex flex-col  conatiner gap-4   md:gap-0 md:flex-row  justify-between items-center ">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="" />
          </Link>

          <div className="flex flex-col  gap-4   md:flex-row items-center  gap-x-[60px] ">
            <Link
              href={"#"}
              className="text-white font-semibold font-inter text-[20px]  leading-5"
            >
              About
            </Link>

            <div className="relative">
              <Link
                href={"/"}
                className="text-white font-semibold font-inter text-[20px]  leading-5 "
              >
                Plan a New Event
              </Link>

              <div className=" absolute bg-greenF  h-[8px] w-[60px] bottom-[-26px]  left-[39%] rounded-tl-[100px] rounded-tr-[100px]"></div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
