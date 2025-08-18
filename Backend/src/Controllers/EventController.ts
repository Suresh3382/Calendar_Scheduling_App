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
    recurrenceEnd,
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
      recurrenceEnd,
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
    if (requestedUserId === loggedInUserId) {
      const events = await EventModel.find({ userId: loggedInUserId });
      console.log("Evemts: ", events)
      return res.status(200).json({ success: true, data: events });

    } else {
      const events = await EventModel.find({
        userId: String(requestedUserId),
        visibility: "PUBLIC",
      });
      return res.status(200).json({ success: true, data: events });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const searchEvents = async (req: any, res: Response) => {
  try {
    const loggedInUserId = req?.user?._id?.toString();
    const { searchTerm } = req.body;

    const regex = new RegExp(searchTerm, "i");

    const events = await EventModel.find({
      userId: loggedInUserId,
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