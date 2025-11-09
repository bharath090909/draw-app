import { email, number, z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  number: z.string(),
});
