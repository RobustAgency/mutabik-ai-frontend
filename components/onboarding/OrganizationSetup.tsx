
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const initialState = {
  organizationName: "",
  website: "",
  phone: "",
  country: "",
};

const OrganizationSetup = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    // Example validation
    if (!form.organizationName || !form.website || !form.phone || !form.country) {
      setError("Please fill in all fields.");
      setSubmitting(false);
      return;
    }
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
        router.push("/onboarding?mode=invite-team")
      // Reset form or handle success
      alert("Organization details submitted successfully!");
      setForm(initialState);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-[70vh] w-full">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[596px] py-8 flex flex-col gap-6"
      >
        <div>
          <h1 className="text-xl md:text-4xl font-bold text-[#1D2939] mb-2">Organization setup</h1>
          <p className="text-[#667085] text-xs md:text-sm font-normal">
            For the purpose of industry regulation, your organization details are required
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div>
            <Label htmlFor="organizationName" className="mb-1 text-sm text-[#344054] font-medium">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              placeholder="Acme Inc."
              value={form.organizationName}
              onChange={handleChange}
              className="mt-1 h-[44px] text-lg bg-white border-[#D0D5DD]  rounded-[8px] placeholder:text-[#98A2B3]"
              autoComplete="organization"
            />
          </div>
          <div>
            <Label htmlFor="website" className="mb-1 text-sm text-[#344054]">Website</Label>
            <Input
              id="website"
              name="website"
              placeholder="www.acme.com"
              value={form.website}
              onChange={handleChange}
              className="mt-1 h-[44px] text-lg bg-white   border-[#D0D5DD] rouded-[8px] placeholder:text-[#98A2B3]"
              autoComplete="url"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1 text-sm text-[#344054]">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+01 234 557 690"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 h-[44px] text-lg bg-white border-[#D1D5DB] placeholder:text-[#98A2B3]"
              autoComplete="tel"
              type="tel"
            />
          </div>
          <div>
            <Label htmlFor="country" className="mb-1 text-sm text-[#344054]">Country</Label>
            <Input
              id="country"
              name="country"
              placeholder="Enter your country"
              value={form.country}
              onChange={handleChange}
              className="mt-1 h-[44px] text-lg bg-white border-[#D1D5DB] placeholder:text-[#98A2B3]"
              autoComplete="country"
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Button
          type="submit"
          className="mt-2 h-[44px] rounded-lg bg-primary hover:bg-[#32c986] text-white text-sm font-medium w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default OrganizationSetup;
