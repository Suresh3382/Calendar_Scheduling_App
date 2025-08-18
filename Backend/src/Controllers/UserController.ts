import { Response } from "express";
import { UserModel } from "../Models/UserModel";
import { error } from "console";

export const getUser = async (req: any, res: Response) => {
    const email = req.params.email;
    const loggedUserEmail = req.user.email;
    if (!email) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    try {
        const users = await UserModel.find({
            email: {
                $regex: new RegExp(email),
                $ne: loggedUserEmail
            }
        });


        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: (error as Error).message
        });
    }
};


export const getLoggedUser = async (req: any, res: Response) => {
    const loggedInUserId = req?.user?._id;
    const response = await UserModel.findById(loggedInUserId);
    if (response) {
        return res.status(200).json({ success: true, response });
    }
    else {
        return res.status(400).json({ success: false, message: "user not found!" });
    }
}