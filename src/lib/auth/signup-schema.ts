import { z } from "zod";

export const signupSchema = z
  .object({
    displayName: z.string().trim().min(2, "Nama minimal 2 karakter").max(150),
    email: z.string().trim().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    phoneNumber: z.string().trim().min(8, "Nomor telepon tidak valid").max(20),
    address: z.string().trim().min(5, "Alamat wajib diisi"),
    role: z.enum(["donor", "beneficiary", "processor"]),
    isOrganization: z.boolean(),
    organizationCapacity: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "beneficiary" && data.isOrganization && !data.organizationCapacity) {
      ctx.addIssue({ code: "custom", path: ["organizationCapacity"], message: "Jumlah anggota wajib diisi" });
    }
  });

export type SignupInput = z.infer<typeof signupSchema>;
