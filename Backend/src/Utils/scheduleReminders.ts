import cron from "node-cron";
import dayjs from "dayjs";
import { EventModel } from "../Models/EventModal";
import { UserModel } from "../Models/UserModel";
import { sendReminder } from "./emailReminder";

export const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    const now = dayjs();

    const events = await EventModel.find({
      start: { $gte: now.toDate(), $lte: now.add(31, "minute").toDate() },
      notification: true,
    }); 

    for (const event of events) {
      const user = await UserModel.findById(event.userId);
      if (!user) continue;
      await sendReminder(user.email, event.title, event.start.toISOString());
      await event.save(); 
      console.log(`Reminder sent for event: ${event.title} to ${user.email}`);
    }
  });
};
