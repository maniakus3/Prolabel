import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const getProductAdvice = async (userQuery: string, productContext: string): Promise<string> => {
  initializeAI();
  
  if (!ai) {
    return "Przepraszam, klucz API nie został skonfigurowany. Proszę skontaktować się z administratorem.";
  }

  try {
    const model = ai.models;
    const prompt = `
      Jesteś ekspertem technicznym w firmie Prolabel (drukarnia).
      
      Oto nasza oferta produktów:
      ${productContext}
      
      Klient pyta: "${userQuery}"
      
      Twoim zadaniem jest doradzić klientowi, który produkt z naszej oferty będzie najlepszy do jego potrzeb. 
      Bądź uprzejmy, profesjonalny i zwięzły. Jeśli pytanie nie dotyczy druku/etykiet, grzecznie odmów odpowiedzi.
      Odpowiadaj po polsku.
    `;

    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return result.text || "Przepraszam, nie udało mi się wygenerować porady.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wystąpił błąd podczas łączenia z asystentem AI. Spróbuj ponownie później.";
  }
};
