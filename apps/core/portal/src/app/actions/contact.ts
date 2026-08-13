"use server";

import { createLead as dbCreateLead } from "@atpdev/database";

export async function createLead(name: string, email: string, message: string, phone: string = "") {
  try {
    const success = await dbCreateLead({
      name,
      email,
      phone,
      message,
      company: "Desde Portafolio", // Default or you could add a field for it
    });
    return success;
  } catch (error) {
    console.error("Action error:", error);
    return false;
  }
}
