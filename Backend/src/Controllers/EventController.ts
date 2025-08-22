import dayjs from "dayjs";
import { EventModel } from "../Models/EventModal";
import { Request, Response } from "express";

export const AddEvent = async (req: any, res: Response) => {
  const {
    title,
    description,
    start,
    end,
    fromTime,
    toTime,
    notification,
    recurrence,
    visibility,
    guest,
    location,
  } = req.body;
  const userId = req?.user?._id;

  try {
    const response = await EventModel.create({
      userId,
      title,
      description,
      start,
      end,
      fromTime,
      toTime,
      notification,
      recurrence,
      visibility,
      guest,
      location,
    });

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEvents = async (req: any, res: Response) => {
  const loggedInUserId = req.user?._id?.toString();
  const requestedUserId = req?.body?.requestedUserId;

  try {
    let events;

    if (requestedUserId === loggedInUserId) {
      events = await EventModel.find({ userId: loggedInUserId });
    } else {
      events = await EventModel.find({
        userId: String(requestedUserId),
        visibility: "PUBLIC",
      });
    }

    const expandedEvents: any[] = [];

    events.forEach((event) => {
      const { start, end, recurrence } = event;

      if (recurrence === "NO") {
        expandedEvents.push(event);
      } else if (recurrence === "DAILY") {
        for (let i = 0; i < 365; i++) {
          expandedEvents.push({
            ...event.toObject(),
            start: dayjs(start).add(i, "day").toDate(),
            end: dayjs(end).add(i, "day").toDate(),
          });
        }
      } else if (recurrence === "WEEKLY") {
        for (let i = 0; i < 52; i++) {
          expandedEvents.push({
            ...event.toObject(),
            start: dayjs(start).add(i, "week").toDate(),
            end: dayjs(end).add(i, "week").toDate(),
          });
        }
      }
    });

    return res.status(200).json({ success: true, data: expandedEvents });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const searchEvents = async (req: any, res: Response) => {
  try {
    const { searchTerm, userId } = req.body;

    const regex = new RegExp(searchTerm, "i");

    const events = await EventModel.find({
      userId: userId,
      title: { $regex: regex },
    });

    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEvent = async (req: any, res: Response) => {
  const eventID = req.params.id;
  try {
    await EventModel.findByIdAndDelete(eventID);
    return res.status(200).json({ success: true, message: "Event deleted sucessfully!" });
  } catch (error) {
    return res.status(500).json({ sucess: false, error: error });
  }
}