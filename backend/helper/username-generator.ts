import UserModel from "../models/entity/user.entity";

export default async function generateUsername(base: string) {
  let username;
  let exists = true;

  while (exists) {
    const rand = Math.floor(100000 + Math.random() * 900000);
    username = `${base.length > 5 ? base.slice(0, 5) : base}${rand}`;
    exists = !!(await UserModel.exists({ username }));
  }

  return username;
}
