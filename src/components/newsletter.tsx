"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";
import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className=" ">
      <div className="flex flex-col items-center justify-center">
        <MotionWrapper variant="fadeUp" delay={0.2}>
          <h2 className="text-4xl font-bold mb-2 font-poppins">
            Stay In The Loop
          </h2>
        </MotionWrapper>
        
        <MotionWrapper variant="fadeUp" delay={0.4}>
          <div className="w-1/2 text-center">
            <p className="text-gray-200 mb-8 font-vietnam">
              Sign up for our newsletter and get updates on new courses, podcasts
              and exclusive content from NewLabel
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper variant="scale" delay={0.6}>
          <div className="w-2/3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Input
                className="w-full rounded-[50px] bg-[#FFFFFF1A]"
                placeholder="    johndoe@gmail.com"
              />
            </motion.div>
          </div>
        </MotionWrapper>
        
        <MotionWrapper variant="scale" delay={0.8}>
          <div className="mt-8 mb-20">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-[#70E002] font-inter hover:bg-[#6BC91A] px-20 text-black font-bold ">
                Submit
              </Button>
            </motion.div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
