'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Newsletter() {
  return (
    <section className="px-6 py-16 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">Stay In The Loop</h2>
      <p className="text-gray-400 mb-8">
        Subscribe to our newsletter to get updates on new content, podcasts and exclusive content from NewLabel
      </p>
      
      <div className="flex max-w-md mx-auto">
        <Input 
          type="email" 
          placeholder="Enter your email"
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-r-none"
        />
        <Button className="bg-[#7ED321] hover:bg-[#6BC91A] text-black font-medium rounded-l-none px-6">
          Sign Up
        </Button>
      </div>
    </section>
  )
}
