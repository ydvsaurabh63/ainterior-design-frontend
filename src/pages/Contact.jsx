import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { enquiryApi } from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await enquiryApi.create(formData);
      toast.success('Your enquiry has been submitted successfully!');
      setSubmittedSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-studio-bg min-h-screen pt-24 sm:pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-studio-bronze font-semibold mb-2.5">
            <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
            <span>Get In Touch</span>
            <span className="w-5 sm:w-6 h-px bg-studio-bronze" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-studio-charcoal font-normal tracking-tight mb-3">
            Send Us An Enquiry
          </h1>
          <p className="text-xs sm:text-sm text-studio-muted leading-relaxed font-light max-w-lg mx-auto">
            Have a question or looking to discuss your space? Fill in your details below and our team will get back to you shortly.
          </p>
        </div>

        {/* Simple Enquiry Form Card */}
        <div className="bg-white p-6 sm:p-10 border border-studio-border shadow-luxury">
          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-10 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-studio-sand flex items-center justify-center text-studio-bronze mx-auto mb-2 border border-studio-border">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-studio-charcoal">
                Enquiry Submitted Successfully
              </h3>
              <p className="text-xs sm:text-sm text-studio-muted max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. We have received your message and will contact you via phone or email shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="mt-4 px-6 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-studio-bronze transition-colors"
              >
                Send Another Enquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 sm:py-3 bg-studio-bg border border-studio-border text-xs sm:text-sm text-studio-charcoal placeholder-studio-muted/70 focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-studio-bg border border-studio-border text-xs sm:text-sm text-studio-charcoal placeholder-studio-muted/70 focus:outline-none focus:border-studio-bronze transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-studio-bg border border-studio-border text-xs sm:text-sm text-studio-charcoal placeholder-studio-muted/70 focus:outline-none focus:border-studio-bronze transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                  Your Enquiry / Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="How can we help you? Tell us about your enquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 sm:py-3 bg-studio-bg border border-studio-border text-xs sm:text-sm text-studio-charcoal placeholder-studio-muted/70 focus:outline-none focus:border-studio-bronze transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-all duration-300 flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Enquiry...</span>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Quick Contact Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-8 sm:mt-10">
          <a
            href="tel:+918147540362"
            className="p-3.5 sm:p-4 bg-white border border-studio-border flex items-center gap-3 hover:border-studio-bronze transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-studio-sand flex items-center justify-center text-studio-bronze flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-studio-muted font-bold block">
                Call Us
              </span>
              <span className="text-xs font-semibold text-studio-charcoal truncate block group-hover:text-studio-bronze transition-colors">
                +91 81475 40362
              </span>
            </div>
          </a>

          <a
            href="mailto:contact@diintech.com"
            className="p-3.5 sm:p-4 bg-white border border-studio-border flex items-center gap-3 hover:border-studio-bronze transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-studio-sand flex items-center justify-center text-studio-bronze flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-studio-muted font-bold block">
                Email
              </span>
              <span className="text-xs font-semibold text-studio-charcoal truncate block group-hover:text-studio-bronze transition-colors">
                contact@diintech.com
              </span>
            </div>
          </a>

          <div className="p-3.5 sm:p-4 bg-white border border-studio-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-studio-sand flex items-center justify-center text-studio-bronze flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-studio-muted font-bold block">
                Location
              </span>
              <span className="text-xs font-semibold text-studio-charcoal truncate block">
                Sector-2, Noida, India
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Location Map */}
      <section className="mt-16 sm:mt-20 border-t border-studio-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-studio-bronze font-semibold block mb-1.5">
              Studio Location
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-studio-charcoal">
              Visit Our Experience Studio
            </h3>
          </div>

          <div className="w-full h-[300px] sm:h-[380px] md:h-[420px] border border-studio-border overflow-hidden relative shadow-luxury">
            <iframe
              title="Studio Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.5855217430137!2d77.31298497550186!3d28.582207975691068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45fc0000001%3A0xb3ff76c66cf13a5b!2sSector%202%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


