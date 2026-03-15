# AI A11y Debugger CLI

A command-line tool that uses Anthropic's Claude API to analyze a code snippet and description of an accessibility issue to determine the likely cause, solution, relevant WCAG criterion, and confidence level and reason.

The program accepts a multi-line code snippet and multi-line accessibility issue description from the user, sends it to the Claude API, and returns:

- A likely cause of the accessibility issue

- A potential solution to fix the issue

- The relevant WCAG criterion

- A confidence score (0–100%)

- A brief explanation of the confidence level

This tool is designed for manual accessibility testers and developers to speed up debugging of accessibility issues discovered through manual or automated testing.

## Features

- Interactive CLI
- Multi-line code input
- Structured JSON responses from the Claude API
- Confidence scoring and reasons behind confidence score

## Requirements

- Node.js
- An API key from Anthropic

## Installation

Install dependencies:
```bash
npm install
```

## Setup

Create a .env file:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```
Do not use quotation marks around the API key.

You can obtain an API key from the Anthropic developer console: platform.claude.com.

## Run

```bash
tsc
npm start
```

## Usage

1. Paste the code snippet of the element causing the issue
2. Type END on a new line when finished and press ENTER
3. Type a description of the encountered accessibility issue
4. Type END on a new line when finished and press ENTER

Example

```bash
Paste snippet of code of the element causing the issue, then type END on a new line when finished

<span class="tbm-link level-1 no-link tbm-toggle" tabindex="0" aria-expanded="false">
                Visit
          </span>
END

Describe the accessibility issue you encountered (e.g. "The button label is not read by JAWS" or "The tab doesn't receive keyboard focus"), then type END on a new line when finished:

VoiceOver reads this menu dropdown button as a group and does not convey whether it is expanded or collapsed
END

Processing...


Likely cause: The element is a <span> with a role implied as generic/group. It lacks an explicit ARIA role of 'button', which means VoiceOver does not treat it as an interactive button and may not properly announce the aria-expanded state. VoiceOver requires an element to have a role of 'button' (or be a native <button>) for aria-expanded to be meaningfully conveyed as expanded/collapsed state.

Suggested Solution: Replace the <span> with a native <button> element, or add role="button" to the <span>. Additionally, ensure the element has a meaningful accessible name via aria-label or aria-labelledby (e.g., aria-label="Menu") so VoiceOver can announce both the label and the expanded/collapsed state. Example: <button class="tbm-link level-1 no-link tbm-toggle" aria-expanded="false" aria-label="Menu">...</button>

WCAG Criterion: WCAG 4.1.2 Name, Role, Value (Level A)

Confidence level: 92%

Confidence Reason: The use of a <span> instead of a native <button> or an element with role="button" is a well-known cause of VoiceOver failing to announce aria-expanded correctly, as VoiceOver relies on the button role to surface state changes. The lack of an accessible name also contributes to poor announcement. Confidence is high but not 1.0 because without seeing the full rendered DOM and VoiceOver output, there is a small chance other factors (e.g., surrounding ARIA markup) may also contribute.
```

## Project Structure

```bash
src/
  apiClient.ts   # Handles communication with the Claude API
  index.ts       # CLI interface and user input
```

## Technologies Used

- TypeScript
- Node.js
- Anthropic SDK
- dotenv
- readline

## License

MIT License

Copyright (c) 2026 Luke Kudryashov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
