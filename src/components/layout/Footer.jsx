"use client";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#2a2a2a] to-[#1f1f1f] text-gray-300 pt-16 pb-8 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Address */}
        <div>
          <Image
            src="/image 4.png"
            alt="Koseli Colorado Logo"
            width={180}
            height={100}
            className="mb-4"
          />
          <p className="text-sm text-gray-400 mb-2">
            Aurora, Colorado, USA
          </p>
          <p className="text-sm text-gray-300 mb-6">
            Promoting Nepali Cinema & Music across the U.S. and Canada.
          </p>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-brand-primary transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-brand-primary transition"><FaInstagram /></a>
            <a href="#" className="hover:text-brand-primary transition"><FaYoutube /></a>
            <a href="#" className="hover:text-brand-primary transition"><FaTiktok /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-brand-primary inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-brand-primary transition">About Us</Link></li>
            <li><Link href="/events" className="hover:text-brand-primary transition">Events</Link></li>
            <li><Link href="/gallery" className="hover:text-brand-primary transition">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-brand-primary transition">Contact</Link></li>
          </ul>
        </div>

        {/* Our Involvement */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-brand-primary inline-block pb-1">
            Our Involvement
          </h3>
          <ul className="space-y-2">
            <li><span className="hover:text-brand-primary cursor-pointer transition">Cultural Events</span></li>
            <li><span className="hover:text-brand-primary cursor-pointer transition">Concerts</span></li>
            <li><span className="hover:text-brand-primary cursor-pointer transition">Community Work</span></li>
            <li><span className="hover:text-brand-primary cursor-pointer transition">Collaborations</span></li>
          </ul>
        </div>

        {/* Our Commitment */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-brand-primary inline-block pb-1">
            Our Commitment
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            At Koseli Colorado, we’re dedicated to uplifting Nepali culture,
            supporting local talent, and creating unforgettable experiences
            for the community.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Koseli Colorado LLC. All Rights Reserved.</p>
        <p className="mt-1 text-xs">
          Designed & Developed by <span className="text-brand-primary font-semibold">Anrika Tech</span>
        </p>
      </div>
    </footer>
  );
}
