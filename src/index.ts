// Runs the program and prints the result

//import getResponse function from apiClient.js
import { getResponse } from './apiClient.js';
//import readline
import * as readline from 'readline/promises';

//take user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// gets and returns multiline user input
async function readMultiline(prompt: string): Promise<string> {
    console.log(prompt);

    let input = "";

    while (true) {
        const line = await rl.question("");
        if (line.trim() === "END") break;
        input += line + "\n";
    }
    return input;
}

//gets and returns code snippet user input
async function askForCode(): Promise<string> {
    return await readMultiline("\nPaste snippet of code of the element causing the issue, then type END on a new line when finished\n");
}

//takes code snippet, gets issue description, calls Claude AI API with both and prints response
async function askForIssue(code: string) {
    const issue = await readMultiline(`\nDescribe the accessibility issue you encountered (e.g. "The button label is not read by JAWS" or "The tab doesn't receive keyboard focus"), then type END on a new line when finished:\n`);
    try {
        console.log("\nProcessing...\n");
        const response = await getResponse(code, issue);
        const confidencePercent = response.confidence_level*100;
        console.log(`\nLikely cause: ${response.likely_cause}\n\nSuggested Solution: ${response.solution}\n\nWCAG Criterion: ${response.wcag_criterion}\n\nConfidence level: ${confidencePercent}%\n\nConfidence Reason: ${response.confidence_reason}\n`);
    } catch(error) {
        console.error(error);
    } finally {
        rl.close();
    }
}

const code = await askForCode();
await askForIssue(code);