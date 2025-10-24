"use client";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContact() {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL ||
          (typeof window !== "undefined" ? "" : "http://localhost:3000");

        const res = await fetch(`${base}/api/contact`, { cache: "no-store" });
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  if (loading) {
    return (
      <main className="bg-[#1b1a1f] text-white min-h-screen flex items-center justify-center">
        <p>Loading contact info...</p>
      </main>
    );
  }

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      {/* Header */}
      <section className="py-20 text-center bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f]">
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Contact Us
        </h1>
        <div className="w-1 h-10 bg-brand-primary mx-auto mt-3 rounded"></div>
        <p className="text-gray-200 mt-4 text-base">
          Get in touch with Koseli Colorado USA — we’d love to hear from you.
        </p>
      </section>

      {/* Contact Info */}
      <section className="container max-w-3xl mx-auto text-center py-12 space-y-4 px-6">
        {contact?.address && (
          <p className="text-lg">
            <strong>📍 Address:</strong> {contact.address}
          </p>
        )}
        {contact?.phone && (
          <p className="text-lg">
            <strong>📞 Phone:</strong> {contact.phone}
          </p>
        )}
        {contact?.email && (
          <p className="text-lg">
            <strong>📧 Email:</strong> {contact.email}
          </p>
        )}

        <div className="flex justify-center gap-8 mt-6 text-xl">
          {contact?.facebookUrl && (
            <a
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors"
            >
              Facebook
            </a>
          )}
          {contact?.instagramUrl && (
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors"
            >
              Instagram
            </a>
          )}
          {contact?.youtubeUrl && (
            <a
              href={contact.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors"
            >
              YouTube
            </a>
          )}
        </div>
      </section>

      {/* Google Map */}
      <section className="bg-[#1b1a1f] py-12">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-800">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.793783562558!2d-105.1217684243168!3d40.14581047208447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876bf98c6f91bdf5%3A0x94b7ba0678f6f117!2s1255%20Bistre%20St%2C%20Longmont%2C%20CO%2080501%2C%20USA!5e1!3m2!1sen!2snp!4v1761136898227!5m2!1sen!2snp"
            className="w-full h-[400px] md:h-[500px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
