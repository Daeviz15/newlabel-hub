"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className=" ">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-2 font-poppins">
          Stay In The Loop
        </h2>
        
        <div className="w-1/2 text-center">
          <p className="text-gray-200 mb-8 font-vietnam">
            Sign up for our newsletter and get updates on new courses, podcasts
            and exclusive content from NewLabel
          </p>
        </div>

        <div className="w-2/3">
          <Input
            className="w-full rounded-[50px] bg-[#FFFFFF1A]"
            placeholder="    johndoe@gmail.com"
          />
        </div>
        
        <div className="mt-8 mb-20">
          <Button className="bg-[#70E002] font-inter hover:bg-[#6BC91A] px-20 text-black font-bold ">
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
}
