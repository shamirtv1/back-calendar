import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export type IncidentDocument = HydratedDocument<Incident>;

@Schema()
export class Incident {

    @Prop()
    title: string;

    @Prop()
    notes: string;

    @Prop()
    start: Date;

    @Prop()
    end: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;
}



export const IncidentSchema = SchemaFactory.createForClass(Incident); 
IncidentSchema.set('versionKey', false)