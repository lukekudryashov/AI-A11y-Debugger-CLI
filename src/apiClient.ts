//Handles API Call to Claude AI API

import Anthropic from "@anthropic-ai/sdk";
//import dotenv
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not defined in environment variables");
}

const client = new Anthropic({apiKey: API_KEY});
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;
const SYSTEM = `You are an accessibility expert helping manual testers determine what in the code is causing a detected accessibility issue. Given a code snippet and accessibility issue description, you return a response in the specified JSON format: likely_cause, solution, wcag_criterion, confidence_level between 0 and 1, and confidence_reason.`;


interface ResponseType { 
    likely_cause: string;
    solution: string;
    wcag_criterion: string; 
    confidence_level: number; 
    confidence_reason: string
}

//async function to fetch data from Claude AI API
//takes string code and issue, returns object response in ResponseType format
export async function getResponse(code: string, issue: string): Promise<ResponseType> {
    //send message
    const message = `Code: ${code}. Issue: ${issue}`;
    const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM,
        messages: [{content: message, 
            role: "user"}],
        output_config: {
            format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        likely_cause: {type: "string"},
                        solution: {type: "string"},
                        wcag_criterion: {type: "string"},
                        confidence_level: {type: "number"},
                        confidence_reason: {type: "string"}
                    },
                required: ["likely_cause", "solution", "wcag_criterion", "confidence_level", "confidence_reason"],
                additionalProperties: false
                }
            }
        }
        });
    // console.log(response);
    const block = response.content[0];
    if (block && block.type === "text") {
        try {
            const responseObject: ResponseType = JSON.parse(block.text);
            return responseObject;
        } catch {
            throw new Error("Failed to parse Claude response.");
        }
    } else {
        throw new Error("Claude was not able to generate a response.");
    }
}