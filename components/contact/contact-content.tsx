'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Zod Validation Schema
const contactSchema = z.object({
  fullName: z.string().min(3, { message: "Full Name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string()
    .length(10, { message: "Phone Number must be exactly 10 digits." })
    .regex(/^\d+$/, { message: "Phone Number must contain only digits." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactContent() {
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact Form Submitted Data:", data);
    
    // Trigger Success Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    
    // Reset Form
    reset();
  };

  const storeInfo = [
    {
      icon: MapPin,
      title: "Store Address",
      details: [
        "Nexora Mobile Store",
        "Bhanugudi Center",
        "Kakinada",
        "Andhra Pradesh - 533003",
        "India"
      ],
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30",
    },
    {
      icon: Phone,
      title: "Phone Number",
      details: ["+91 9032535343", "Available for queries"],
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: ["support@nexora.com", "response within 24 hours"],
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/30",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon – Sat: 9:00 AM – 8:00 PM", "Sunday: Closed"],
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Dynamic Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-2xl border border-zinc-800 dark:border-zinc-200 shadow-2xl select-none"
            role="alert"
          >
            <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-500/10 shrink-0" />
            <span className="text-xs font-bold tracking-wide">Your message has been sent successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* Left Side: Store Information */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-2">
            Store Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {storeInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.008)] hover:shadow-md transition-all duration-300"
                >
                  <div className={cn("size-10 rounded-xl flex items-center justify-center border shrink-0", info.color)}>
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                      {info.title}
                    </h4>
                    {info.details.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className={cn(
                          "text-sm text-zinc-700 dark:text-zinc-300 font-semibold",
                          lIdx > 0 && "text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium"
                        )}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/85 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col">
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-6">
            Send Message
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-550 transition-colors",
                    errors.fullName && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                  )}
                  {...register("fullName")}
                />
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium"
                    >
                      <AlertCircle className="size-3.5" />
                      <span>{errors.fullName.message}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="johndoe@email.com"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-550 transition-colors",
                    errors.email && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                  )}
                  {...register("email")}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium"
                    >
                      <AlertCircle className="size-3.5" />
                      <span>{errors.email.message}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Row 2: Phone Number & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="9032535343"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-550 transition-colors",
                    errors.phone && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                  )}
                  {...register("phone")}
                />
                <AnimatePresence>
                  {errors.phone && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium"
                    >
                      <AlertCircle className="size-3.5" />
                      <span>{errors.phone.message}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Inquiry about iPhone 15"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-550 transition-colors",
                    errors.subject && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                  )}
                  {...register("subject")}
                />
                <AnimatePresence>
                  {errors.subject && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium"
                    >
                      <AlertCircle className="size-3.5" />
                      <span>{errors.subject.message}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Write your message here... (minimum 20 characters)"
                className={cn(
                  "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-550 transition-colors resize-none",
                  errors.message && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                )}
                {...register("message")}
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium"
                  >
                    <AlertCircle className="size-3.5" />
                    <span>{errors.message.message}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-6 px-8 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2 group/btn"
              >
                <Send className="size-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
              </Button>
            </div>

          </form>
        </div>

      </div>

      {/* Embedded Map Section */}
      <section className="w-full">
        <h3 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-6">
          Locate Our Store
        </h3>
        <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-150/60 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.005)] aspect-[21/9] sm:aspect-[21/9] md:aspect-[21/7] min-h-[300px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.335345672922!2d82.23594897505322!3d16.931899183921315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382877543818e3%3A0x67584144570077c5!2sBhanugudi%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1720878000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nexora Mobile Store Location Map"
            className="absolute inset-0"
          />
        </div>
      </section>
    </div>
  );
}
