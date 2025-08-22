import { getModelForClass, prop } from "@typegoose/typegoose";

export class Event {
    @prop({ required: true })
    public userId: string;

    @prop({ required: true })
    public title: string;

    @prop()
    public description?: string;

    @prop({ required: true, type: Date })
    public start: Date;

    @prop({ required: true, type: Date })
    public end: Date;

    @prop()
    public notification: boolean;

    @prop()
    public recurrence: "DAILY" | "WEEKLY" | "NO";

    @prop({ required: true })
    public visibility: "PUBLIC" | "PRIVATE";

    @prop()
    public guest: string;

    @prop()
    public location?: string;
}

export const EventModel = getModelForClass(Event);
