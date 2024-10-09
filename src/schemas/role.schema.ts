import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  role: string;

  @Prop({ type: [String], default: [] })
  permissions: Permissions[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
