import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    fullName: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    createdOn: { type: Date, default: new Date().getTime() },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = model("User", UserSchema);
