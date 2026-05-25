import axios from "axios";

// Just a placeholder for any other API needs
export const sendChatMessage = async (message: string): Promise<string> => {
  // Simulate delay and response since we don't have a real endpoint here
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("That's a great question. Let's work on improving that specific area.");
    }, 1500);
  });
};
