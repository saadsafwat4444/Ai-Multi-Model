import { Injectable } from "@nestjs/common";

 @Injectable()
 
export class GrokService {
  private readonly API_URL = "https://router.huggingface.co/v1/chat/completions";
  private readonly API_KEY = process.env.Grok_API_KEY;

  async sendMessage(message: string): Promise<string> {
    try {
      console.log("API_KEY:", this.API_KEY ? "exists" : "missing");
      console.log("API_URL:", this.API_URL);

      const res = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-70B-Instruct",
          messages: [
            { 
              role: "system", 
              content: "You are a helpful, accurate, and detailed AI assistant. Always provide clear, well-structured, and informative responses. When answering questions, be thorough and give complete information." 
            },
            { role: "user", content: message }
          ],
          max_tokens: 1500,
          temperature: 0.3
        }),
      });

      const data = await res.json() as any;

      if (!res.ok || data.error) {
        console.error("Hugging Face Router API Error:", data.error || res.statusText);
        return `HF Error: ${data.error || res.statusText}`;
      }

      // Router API response format - OpenAI compatible
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }

      // Fallback for old format
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }

      if (data.generated_text) {
        return data.generated_text;
      }

      console.log("Full response:", JSON.stringify(data, null, 2));
      return "No response from Grok demo";
    } catch (err) {
      console.error("Fetch error:", err);
      
      // Check for quota/rate limit errors
      if (err.message && (err.message.includes('quota') || err.message.includes('429') || err.message.includes('rate limit'))) {
        return "⏰ وصلت للحد الأقصى من الطلبات. حاول مرة أخرى بعد قليل أو استخدم موديل آخر.";
      }
      
      return "Failed to connect to Grok demo";
    }
  }

  /**
   * Send message with conversation history to maintain context
   * @param messages Array of conversation messages with role and content
   * @returns Generated response
   */
  async sendMessageWithHistory(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      console.log("API_KEY:", this.API_KEY ? "exists" : "missing");
      console.log("API_URL:", this.API_URL);
      console.log("Conversation history:", messages.length, "messages");

      const res = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-70B-Instruct",
          messages: [
            { 
              role: "system", 
              content: "You are a helpful, accurate, and detailed AI assistant. Always provide clear, well-structured, and informative responses. When answering questions, be thorough and give complete information." 
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 1500,
          temperature: 0.3
        }),
      });

      const data = await res.json() as any;

      if (!res.ok || data.error) {
        console.error("Hugging Face Router API Error:", data.error || res.statusText);
        return `HF Error: ${data.error || res.statusText}`;
      }

      // Router API response format - OpenAI compatible
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }

      // Fallback for old format
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }

      console.log("Full response:", JSON.stringify(data, null, 2));
      return "No response from Grok demo";

    } catch (err) {
      console.error("Fetch error:", err);
      
      // Check for quota/rate limit errors
      if (err.message && (err.message.includes('quota') || err.message.includes('429') || err.message.includes('rate limit'))) {
        return "⏰ وصلت للحد الأقصى من الطلبات. حاول مرة أخرى بعد قليل أو استخدم موديل آخر.";
      }
      
      return "Failed to connect to Grok demo";
    }
  }
}