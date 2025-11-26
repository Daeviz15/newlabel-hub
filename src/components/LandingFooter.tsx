import footerLogo from "/assets/logo.png";
import facebook from "/assets/facebook.png";
import twitter from "/assets/twitter.png";
import instagram from "/assets/instagram.png";
import { Link } from 'react-router-dom';
import { MotionWrapper, StaggerContainer, StaggerItem } from "./motion-wrapper";
import { motion } from "framer-motion";

const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#70E002] text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <StaggerContainer delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Section - Logo and Description */}
            <StaggerItem variant="fadeUp">
              <div className="lg:col-span-2 space-y-8">
                {/* Logo */}
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={footerLogo} alt="footerLogo" />
                  <h1 className="font-bold font-montserrat text-4xl">newlabel</h1>
                </motion.div>

                {/* Description */}
                <motion.div
                  className="w-[270px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-black text-[14px] leading-loose max-w-md font-poppins font-light ">
                    Newlabel is your go-to platform for a world of entertainment,
                    offering a vast library of films, TV shows, and exclusive
                    content.
                  </p>
                </motion.div>

                {/* Social Media Icons */}
                <div className="flex space-x-6">
                  {[
                    { icon: facebook, alt: "facebook" },
                    { icon: twitter, alt: "twitter" },
                    { icon: instagram, alt: "instagram" },
                  ].map((social, index) => (
                    <motion.a
                      key={social.alt}
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <img src={social.icon} width={38} alt={social.alt} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Company Column */}
            <StaggerItem variant="fadeUp">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3
                  className="text-black font-semibold text-lg font-poppins"
                  whileHover={{ x: 5 }}
                >
                  Company
                </motion.h3>
                <ul className="space-y-8 text-[14px] font-light">
                  {["About Us", "Brands", "Blog", "Investors"].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    >
                      <motion.a
                        href="#"
                        className="text-black hover:text-gray-700 transition-colors underline font-poppins inline-block"
                        whileHover={{ x: 5, scale: 1.05 }}
                      >
                        {item}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>

            {/* Help & Support Column */}
            <StaggerItem variant="fadeUp">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-black font-semibold text-lg"
                  whileHover={{ x: 5 }}
                >
                  Help & Support
                </motion.h3>
                <ul className="space-y-8 text-[14px] font-light">
                  {["Help Center", "FAQs", "Support", "Account & Payments"].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    >
                      <motion.a
                        href="#"
                        className="text-black hover:text-gray-700 transition-colors underline font-poppins inline-block"
                        whileHover={{ x: 5, scale: 1.05 }}
                      >
                        {item}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>

            {/* Legal Column */}
            <StaggerItem variant="fadeUp">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.h3
                  className="text-black font-semibold text-lg"
                  whileHover={{ x: 5 }}
                >
                  Legal
                </motion.h3>
                <ul className="space-y-8 text-[14px] font-light">
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <motion.div whileHover={{ x: 5, scale: 1.05 }}>
                      <Link
                        to="/termsncondition"
                        className="text-black hover:text-gray-700 transition-colors underline font-poppins inline-block"
                      >
                        Terms & Conditions
                      </Link>
                    </motion.div>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                  >
                    <motion.div whileHover={{ x: 5, scale: 1.05 }}>
                      <Link
                        to="/privacypolicypage"
                        className="text-black hover:text-gray-700 transition-colors underline font-poppins inline-block"
                      >
                        Privacy Policy
                      </Link>
                    </motion.div>
                  </motion.li>
                  {["Cookie Preferences", "Accessibility"].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    >
                      <motion.a
                        href="#"
                        className="text-black hover:text-gray-700 transition-colors underline font-poppins inline-block"
                        whileHover={{ x: 5, scale: 1.05 }}
                      >
                        {item}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Bottom Copyright */}
        <MotionWrapper variant="fadeUp" delay={0.3}>
          <motion.div
            className="mt-12 pt-8 border-t border-black/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-black text-center font-poppins">
              ©All Rights Reserved. 2025 Newlabel TV
            </p>
          </motion.div>
        </MotionWrapper>
      </div>
    </footer>
  );
};

export default LandingFooter;
