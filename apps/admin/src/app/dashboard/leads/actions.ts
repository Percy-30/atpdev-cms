"use server";

import { revalidatePath } from "next/cache";
import { updateLeadStatus as dbUpdateLeadStatus } from "@atpdev/database";

export async function updateLeadStatus(id: number, status: string) {
  const success = await dbUpdateLeadStatus(id, status);
  if (success) {
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");
  }
}
