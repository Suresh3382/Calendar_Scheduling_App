import type { Dayjs } from "dayjs";

export interface EventInterface {
  title: string;
  description: string;
  start: Dayjs;
  end: Dayjs;
  location: string;
  allDay: boolean;
  notification: boolean;
  guest: string;
  visibility: string | null;
}
