import { Metadata } from "next";
import { Phone } from "lucide-react";
import ContactContent from "@/components/contact/contact-content";

export const metadata: Metadata = {
  title: "Contact | Nexora",
  description: "Contact Nexora for smartphone inquiries, support, and assistance.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/40 pb-20">
      {/* Page Header / Hero Section */}
      <section className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900/80 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider select-none">
            <Phone className="size-3 text-blue-600 dark:text-blue-400" />
            <span>📞 Contact Us</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
            We&apos;re Here to Help
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Have a question about a smartphone or need assistance? Contact our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content (Store Information, Form, Map) */}
      <ContactContent />
    </main>
  );
}
