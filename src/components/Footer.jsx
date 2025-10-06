import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo-levelup.svg" 
                alt="LevelUp" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">LevelUp</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering learners worldwide with high-quality online courses. 
              Learn new skills, advance your career, and achieve your goals with our expert instructors.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="About Us" />
              <FooterLink href="#" text="Courses" />
              <FooterLink href="#" text="Instructors" />
              <FooterLink href="#" text="Pricing" />
              <FooterLink href="#" text="Blog" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="#" text="Help Center" />
              <FooterLink href="#" text="Contact Us" />
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="Refund Policy" />
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 LevelUp. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLink href="#" text="Privacy" />
            <FooterLink href="#" text="Terms" />
            <FooterLink href="#" text="Cookies" />
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
)

const FooterLink = ({ href, text }) => (
  <li>
    <a
      href={href}
      className="text-gray-400 hover:text-primary-300 transition-colors"
    >
      {text}
    </a>
  </li>
)

export default Footer
