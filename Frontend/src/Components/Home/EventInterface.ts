import type { Dayjs } from "dayjs";

export interface EventInterface {
  _id?: string;
  userId?: string;
  title: string;
  description: string;
  start: Dayjs;
  end: Dayjs;
  location: string;
  allDay: boolean;
  notification: boolean;
  recurrence?: "DAILY" | "MONTHLY" | "NO" | null,
  guest: string;
  visibility: "PUBLIC" | "PRIVATE" | null;
}
