import { getModelForClass, prop } from "@typegoose/typegoose";

export class Appointment {
    @prop({ required: true })
    public title: string;

    @prop({ required: true })
    public appointmentDuration: number;

    @prop({ type: () => [String], required: true })
    public generalAvailability: string[];

    @prop({ required: true })
    public maxTime: string;

    @prop({ required: true })
    public minTime: string;
}

export const AppointmentModel = getModelForClass(Appointment);
