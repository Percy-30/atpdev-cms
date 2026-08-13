"use server";

export async function getSenderEmail() {
  return process.env.GMAIL_USER || null;
}

export async function generateAiReply(clientName: string, clientMessage: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { error: "No se encontró GEMINI_API_KEY en las variables de entorno." };
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    
    const prompt = `
      Eres Percy Acha Taipe, un experto ingeniero de software, desarrollador fullstack y creador de ATP Dev.
      Estás respondiendo a un mensaje de un cliente potencial que te contactó a través de tu portafolio.
      
      Nombre del cliente: ${clientName}
      Mensaje del cliente: "${clientMessage}"
      
      Reglas de la respuesta:
      1. Sé muy profesional, amable y directo.
      2. Agradece al cliente por contactarte.
      3. Responde al contexto de su mensaje. Si pide una cotización o hablar sobre un proyecto, proponle agendar una breve reunión por Google Meet o conversar más detalles por correo/WhatsApp.
      4. Mantén la respuesta concisa (máximo 2 o 3 párrafos cortos).
      5. No uses corchetes como [Mi número] o [Enlace]. Si no tienes el dato, simplemente diles que te respondan al correo o invítalos a conversar.
      6. Despídete cordialmente como Percy Acha Taipe.
    `;

    const response = await model.generateContent(prompt);
    const reply = response.response.text();
    return { reply };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || "Error al generar la respuesta con IA." };
  }
}

export async function sendEmailReply(to: string, subject: string, text: string) {
  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return { error: "Faltan las credenciales GMAIL_USER o GMAIL_APP_PASSWORD en el archivo .env.local" };
    }

    const nodemailer = (await import("nodemailer")).default;

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Percy Acha Taipe - ATP Dev" <${user}>`,
      to,
      subject,
      text,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email Sending Error:", error);
    return { error: error.message || "Error al enviar el correo." };
  }
}
