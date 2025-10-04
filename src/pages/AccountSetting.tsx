import React from "react"
import { HomeHeader } from "../components/home-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Footer from "@/components/Footer";
import { User, CreditCard } from "lucide-react"


const AccountSetting: React.FC = () => {
  return (
    <div>
      <HomeHeader search="" onSearchChange={() => {}} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-2 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold font-vietnam text-white">Account Settings</h1>
          <p className="text-[#EDEDED] font-Vietnam text-sm sm:text-base">
            Find all your saved, purchased and in-progress content here
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Profile Info Section */}
          <div className="bg-[#262626] rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white font-Vietnam">Profile Info</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300 font-Vietnam font-noraml text-sm mb-2 block">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  defaultValue="John Doe"
                  className="bg-[#262626] border-gray-700 text-white font-Vietnam placeholder-gray-400 focus:border-lime-70focus:ring-1 focus:ring-[#70E002] w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300 font-noraml font-Vietnam text-sm mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="JohnDoe@email.com"
                  className="bg-[#262626] border-gray-700 font-Vietnam text-white placeholder-gray-400 focus:border-lime-70  focus:ring-1 focus:ring-[#70E002] w-full"
                />
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-[#262626]  rounded-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold font-Vietnam  text-white">Billing</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="card" className="text-gray-300 font-noraml font-Vietnam text-sm mb-2 block">
                  Saved Card
                </Label>
                <Input
                  id="card"
                  type="text"
                  defaultValue="**** **** **** 1234"
                  className="bg-[#262626] border-gray-700 text-white font-Vietnam placeholder-gray-400 focus:border-lime-70 focus:ring-1 focus:ring-[#70E002] w-full"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-gray-300 font-noraml font-Vietnam text-sm mb-2 block">
                  Billing Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  defaultValue="1234, King Street, Lagos 233103"
                  className="bg-[#262626] border-gray-700 text-white font-Vietnam placeholder-gray-400 focus:border-lime-70 focus:ring-1 focus:ring-[#70E002] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default AccountSetting;
