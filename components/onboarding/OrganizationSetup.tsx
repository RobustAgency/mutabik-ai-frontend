import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/service/admin/onboarding";

// ✅ Type for form state
interface FormState {
  organizationName: string;
  website: string;
  phone: string;
  country: string;
}

const initialState: FormState = {
  organizationName: "",
  website: "",
  phone: "",
  country: "",
};

const OrganizationSetup: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createOrganization({
        name: form.organizationName,
        website: form.website,
        phone: form.phone,
        country: form.country,
        is_active: 1,
      });
      router.push("/onboarding?mode=invite-team");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create organization.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-[70vh] w-full">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[596px]  flex flex-col gap-6"
      >
        <div>
          <h1 className="text-xl md:text-4xl font-bold text-[#1D2939] mb-2">
            Organization setup
          </h1>
          <p className="text-[#667085] text-xs md:text-sm font-normal">
            For the purpose of industry regulation, your organization details are required
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div>
            <Label htmlFor="organizationName" className="mb-1 text-sm text-[#344054] font-medium">
              Organization Name
            </Label>
            <Input
              id="organizationName"
              name="organizationName"
              placeholder="Acme Inc."
              value={form.organizationName || ""}
              onChange={handleChange}
              className="mt-1 h-11 text-lg bg-white border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A2B3]"
              autoComplete="organization"
              required
            />
          </div>
          <div>
            <Label htmlFor="website" className="mb-1 text-sm text-[#344054]">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              placeholder="www.acme.com"
              value={form.website || ""}
              onChange={handleChange}
              className="mt-1 h-11 text-lg bg-white border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A2B3]"
              autoComplete="url"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1 text-sm text-[#344054]">
              Phone number
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+01 234 557 690"
              value={form.phone || ""}
              onChange={handleChange}
              className="mt-1 h-11 text-lg bg-white border-[#D1D5DB] placeholder:text-[#98A2B3]"
              autoComplete="tel"
              type="tel"
              required
            />
          </div>
          <div>
            <Label htmlFor="country" className="mb-1 text-sm text-[#344054]">
              Country
            </Label>
            <Input
              id="country"
              name="country"
              placeholder="Enter your country"
              value={form.country || ""}
              onChange={handleChange}
              className="mt-1 h-11 text-lg bg-white border-[#D1D5DB] placeholder:text-[#98A2B3]"
              autoComplete="country"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <Button
          type="submit"
          className="mt-2 h-11 rounded-lg bg-primary hover:bg-[#32c986] text-white text-sm font-medium w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default OrganizationSetup;