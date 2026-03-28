import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the Vaigoo Assistant, a highly intelligent digital expert for Vaigoo Innovations. 
Vaigoo Innovations builds intelligent digital systems for modern businesses.

Services: 
1. AI & Machine Learning: Custom LLMs, computer vision, predictive analytics, and AI agent integration.
2. Web Development: High-performance Next.js, React, and robust enterprise-grade applications.
3. Mobile App Development: Premium, fluid iOS and Android experiences.
4. Scalable Cloud Infrastructure: AWS, Vercel, and modern serverless architectures.

Company Vision: "Future of Innovation".
Design Aesthetic: Minimalist, futuristic, and premium.
Process: Discovery (understanding needs), Development (rapid building), and Scaling (long-term growth).

Instructions:
- Be professional, helpful, and concise.
- Always sound futuristic and innovation-focused.
- If asked about contacting the company, guide them to the 'Contact Us' section or let them know an admin can review their inquiries.
- If asked about hiring or careers, point them to the 'Careers' or 'Internships' section.
- Only discuss Vaigoo Innovations and related technologies. Keep it relevant.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ content: "I'm currently resting. Please ensure my brain (API Key) is connected so I can assist you!" }, { status: 200 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I am now configured as the Vaigoo Assistant. How can I help modern businesses innovate today?" }] },
        ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "I encountered a digital glitch. Please try again later." }, { status: 500 });
  }
}
