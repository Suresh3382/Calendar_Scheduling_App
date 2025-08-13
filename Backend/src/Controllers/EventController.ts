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
  const loggedInUserId = req?.user?._id;
  const userId = loggedInUserId.toString();
  const paramId = req?.params?.id;

  try {
    if (paramId === userId) {
      const events = await EventModel.find({ userId: userId });
      console.log("Evemts: ", events)
      return res.status(200).json({ success: true, data: events });

    } else {
      const events = await EventModel.find({
        userId: String(paramId),
        visibility: "PUBLIC",
      });
      // console.log("Evemts: ", events)
      return res.status(200).json({ success: true, data: events });

    }
    //  const events = await EventModel.find({ userId: userId });
    // return res.status(200).json({ success: true, data: events });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message });
  }
};
