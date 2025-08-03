import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-green rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-xl sm:text-2xl">n</span>
              </div>
              <span className="text-foreground font-bold text-2xl sm:text-3xl">newlabel</span>
            </div>
            
            {/* Newsletter Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Sign Up For Our Newsletter!
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8">
                Stay updated with our latest courses, podcast episodes, and exclusive content delivered straight to your inbox.
              </p>
            </div>
            
            {/* Newsletter Form */}
            <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[300px]">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-secondary text-foreground border-border flex-1 h-12 px-4"
                />
                <Button className="bg-muted text-foreground hover:bg-muted/80 font-semibold px-6 py-3 h-12 whitespace-nowrap">
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-green rounded-md flex items-center justify-center">
                  <span className="text-background font-bold text-lg">n</span>
                </div>
                <span className="text-foreground font-bold text-xl">newlabel</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your trusted home for courses and podcasts within a vibrant community. Learn, understand and apply.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-brand-green transition-colors group">
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-background" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-brand-green transition-colors group">
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-background" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Press</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Help & Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-16 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Newlabel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;