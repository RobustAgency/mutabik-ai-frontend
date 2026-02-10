"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeMeeting } from "@/interfaces/CommitteeMeeting";

interface AttendanceRosterFieldProps {
  initialRoster?: string[] | null;
  onRosterChange?: (text: string) => void;
}

export const AttendanceRosterField: React.FC<AttendanceRosterFieldProps> = ({
  initialRoster,
  onRosterChange,
}) => {
  const [attendanceRosterText, setAttendanceRosterText] = useState("");

  useEffect(() => {
    if (initialRoster) {
      const text = initialRoster.join("\n");
      setAttendanceRosterText(text);
      if (onRosterChange) {
        onRosterChange(text);
      }
    }
  }, [initialRoster, onRosterChange]);

  const handleChange = (value: string) => {
    setAttendanceRosterText(value);
    if (onRosterChange) {
      onRosterChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="attendance_roster">Attendance Roster</Label>
      <Textarea
        id="attendance_roster"
        value={attendanceRosterText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter attendees, one per line"
        rows={4}
        className="min-h-20 resize-none"
      />
      <p className="text-xs text-[#667085]">
        Enter one attendee name per line
      </p>
    </div>
  );
};

// Export function to get roster value for form submission
export const getAttendanceRosterValue = (text: string): string[] | null => {
  return text.trim() !== ""
    ? text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    : null;
};
