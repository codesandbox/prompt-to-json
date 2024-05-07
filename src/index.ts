import { ExtractValueType, ObjectSchema } from "./schema";

export { anyOf, string, array, boolean, object, enums } from "./schema";

function createJsonPrompt(prompt: string, json: ObjectSchema<any, any>) {
  return `# How to respond to this prompt
  
## Output schema
The output structure must be a valid JSON object with this JSON schema:

${JSON.stringify(json)}

## Prompt
${prompt}

## Example output

\`\`\`json
{
"foo": "bar"
}
\`\`\`

\`\`\`json
{
"list": ["foo", "bar"]
}
\`\`\`

## Generate output
It is critical that you output a single valid JSON object with no markdown, extraneous text or wrappers.`;
}

export async function promptJson<T extends ObjectSchema<any, any>>(
  prompt: string,
  json: T,
  sendPrompt: (prompt: string) => Promise<string>,
) {
  const response = await sendPrompt(createJsonPrompt(prompt, json));

  return JSON.parse(response) as ExtractValueType<T>;
}
