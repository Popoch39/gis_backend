import User from "#models/user"
import { createUserValidator, updateUserValidator } from "#validators/user";
import { Infer } from "@vinejs/vine/types";

export class UserService {
  async all() {
    return await User.all();
  };

  async create(data: Infer<typeof createUserValidator>) {
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.fullName = data.fullName ?? null;
    await user.save();
    return user;
  }

  async update(id: number, data: Infer<typeof updateUserValidator>) {
    const user = await User.findOrFail(id);
    user.email = data.email ?? user.email;
    user.password = data.password ?? user.password;
    user.fullName = data.fullName ?? user.fullName;
    return user.save();
  }

  async delete(id: number) {
    await User.query().where('id', id).delete();
  }

  async find(id: number) {
    const user = await User.find(id);
    return user;
  }
}
