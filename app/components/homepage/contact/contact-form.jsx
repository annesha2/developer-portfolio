"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";
import { isValidEmail } from "@/utils/check-email";

function ContactForm() {
  const [error, setError] = useState({
    email: false,
    required: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({
        ...error,
        required: false,
      });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    // Required field validation
    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({
        ...error,
        required: true,
      });

      return;
    }

    // Email validation
    if (!isValidEmail(userInput.email)) {
      setError({
        ...error,
        email: true,
      });

      return;
    }

    try {
      setIsLoading(true);

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          name: userInput.name,
          email: userInput.email,
          message: userInput.message,
        },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        },
      );

      toast.success("Message sent successfully!");

      // Clear form
      setUserInput({
        name: "",
        email: "",
        message: "",
      });

      setError({
        email: false,
        required: false,
      });
    } catch (error) {
      console.error("EmailJS Error:", error);

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSendMail}>
        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2">Your Name</label>

          <input
            type="text"
            name="name"
            value={userInput.name}
            onChange={(e) => {
              setUserInput({
                ...userInput,
                name: e.target.value,
              });
              checkRequired();
            }}
            placeholder="Enter your name"
            className="w-full rounded-lg border px-4 py-3 outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2">Your Email</label>

          <input
            type="email"
            name="email"
            value={userInput.email}
            onChange={(e) => {
              const email = e.target.value;

              setUserInput({
                ...userInput,
                email,
              });

              setError({
                ...error,
                email: email.length > 0 && !isValidEmail(email),
                required: false,
              });
            }}
            placeholder="Enter your email"
            className="w-full rounded-lg border px-4 py-3 outline-none"
          />

          {error.email && (
            <p className="mt-2 text-sm text-red-500">
              Please enter a valid email address.
            </p>
          )}
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className="block mb-2">Your Message</label>

          <textarea
            name="message"
            value={userInput.message}
            onChange={(e) => {
              setUserInput({
                ...userInput,
                message: e.target.value,
              });
              checkRequired();
            }}
            placeholder="Write your message..."
            rows={6}
            className="w-full rounded-lg border px-4 py-3 outline-none resize-none"
          />
        </div>

        {/* Required error */}
        {error.required && (
          <p className="mb-4 text-sm text-red-500">All fields are required!</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg px-6 py-3"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              Send Message
              <TbMailForward size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
