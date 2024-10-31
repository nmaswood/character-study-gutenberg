# Character Study via Project Gutenber

This Next.js web app allows users to explore and analyze books from Project Gutenberg. Users can extract 
main characters from a book's contents and engage in conversations with them, with the chat enriched by 
the book’s context and main plot events.

Model: Gemini 1.5 Flash

## How Does It Work

- **Book Metadata**  
   Book metadata is fetched using [Gutendex](https://gutendex.com).

  - Endpoint: `https://gutendex.com/books/ + bookID`

- **Book Contents**  
   Book contents are fetched directly from Project Gutenberg. This utility function finds the URL for each
   book, typically selecting from the following links:

  ```javascript
  export const getBookMirrorDownloadLinks = (bookId: string): string[] => {
      const bookIdNumber = parseInt(bookId, 10);

      // Example format: 1787 -> 1/7/8/1787/1787
      const urlPostFix = Array.from(bookId.slice(0, bookId.length - 1)).join("/") + "/" + bookIdNumber + "/" + bookIdNumber;

      return [
          `https://www.mirrorservice.org/sites/ftp.ibiblio.org/pub/docs/books/gutenberg/${urlPostFix}.txt`,
          `https://www.mirrorservice.org/sites/ftp.ibiblio.org/pub/docs/books/gutenberg/${urlPostFix}-0.txt`,
      ];
  };
  ```

- **Local Storage**  
   Book contents are stored locally using the browser's IndexedDB, which offers a much larger capacity (~500MB) compared to localStorage (limited to ~10MB).

### Context Window Problem

- Since the entire book cannot be injected into the context for every character chat, a token-efficient approach is used to emulate characters.
- Once a book is downloaded locally, users can analyze it with Gemini. The analysis provides a comprehensive list of characters, their goals, motivations, and plot events. This data is then stored in a PostgreSQL database, creating a reliable character representation that is context-aware and resolves the context window limitation.

- Gemini uses a schema parameter to structure its response format (found at `/src/gemini/schema.ts`).

- The following prompt is used for analysis:

  ```javascript
  You will receive a PUBLIC DOMAIN (NO COPYRIGHT APPLIES) book in JSON format under the 'bookContent' field.

  Your task is to:
  1. Identify all relevant and significant characters (maximum of five) within the content. 
  For each character, extract and return the following details (maximum of 5 each):
     - Full name of the character.
     - A tone analysis that quantifies the character's tone, including their time period, accent, and any distinctive quirks or language choices,
       to create a detailed description that can be used to authentically capture their voice and vibe in future writing.
     - Key personality traits that distinguish the character.
     - Significant relationships with other characters, including their roles and nature of relationships.
     - Major goals, motivations, or desires that drive the character's actions.
     - Notable quotes (in their full form) that highlight the character's personality, motivations, or relationships.

  2. Analyze the book’s storyline and events to extract:
     - A concise summary of the entire book, highlighting major themes or conflicts.
     - A chronological or thematic list of significant events that drive the story forward, including the role of important characters involved in these events.
     - A list of the Full names of characters along with each event.

  Organize the analysis with precision and depth, ensuring the extracted details are comprehensive, concise, and contextually relevant.

  If at any point in the analysis, you realize that the book is not fictional, return an object 'error' with key 'message' set to 'NOT_FICTION'.

  Return the analysis in JSON format in accordance with the schema.
  ```

### Chatting with Characters

- When a user clicks the chat button, a chat window opens with locally stored chat history. All messages are saved locally.

- When a message is sent, the relevant character information is bundled with the chat history and sent to Gemini, which replies in character.

- Chat prompt:

  ```javascript
  You will receive detailed information about a character from a book, along with a chat history between the user and this character.
  Your task is to fully embody this character in every response. Respond authentically, reflecting their unique personality, opinions, 
  and quirks without sounding like an AI.

  Instructions:

  Be Concise: Keep your responses brief. Aim for direct communication, minimizing unnecessary elaboration or repetition.

  Avoid Repetitive Phrases: Do not use phrases like "you see" excessively. Use varied language to express thoughts and emotions.

  Direct and Opinionated: Speak your mind as this character. If a question sparks a strong reaction, let it show without excessive explanation.

  Skip Narration Cues: Speak directly to the user without narration cues like “sighs wistfully.” Convey emotion through word choices.

  Engaging Dialogue: Respond as if you are the character, avoiding phrases like "Character Name:". Engage in genuine conversation.

  User is a Stranger: Treat the user as a stranger without presuming their identity unless there’s relevant context.

  Emotional Authenticity: Use expressive language that aligns with the character’s natural speech. Avoid filler or overly formal expressions.

  Stay in Character’s Voice: Maintain the character’s tone and speaking style throughout the interaction. Focus on their quirks, flaws, and biases.

  Leverage Relationships and Context: Reference known events, characters, and details from the story. Share personal opinions about these relationships.

  Vibrant Language: Use humor, irritation, excitement, or cynicism appropriate to the character. Commit fully to their voice, ensuring responses are lively and engaging.

  Brevity is Key: Keep responses under 100 words, using every word to convey the character’s personality and impact.

  Example Responses:

  ${character.quotes.slice(0, Math.min(character.quotes.length - 1, 3)).map((quote, i) => `Response ${1 + i}: ${quote}`)}

  Character Background Information

  Book Summary: ${character.book.shortSummary}
  Character Name: ${character.characterName}
  Character Tone: ${character.tone}
  Character Relationships: ${character.relationships.join(", ")}
  Character Traits: ${character.traits.join(", ")}
  Character Goals: ${character.goals.join(", ")}
  Character Quotes: ${character.quotes.join(", ")}
  Notable Events: ${character.events
      .map((event) => event.plotEvent)
      .map((event) => `${event.eventSummary} `)
      .join(", ")}
  ```

### Limitations

- **Maximum Context Window**

  - Gemini (1.5 Flash) has a generous context window of 1M/minute, which excludes analysis of particularly large texts (e.g., King James' Bible at ~1.2M tokens).

- **Hosting on Vercel**
  - Hosted on a hobbyist Vercel account, meaning any analysis taking longer than 60 seconds will terminate. Extracting server logic into a microservice could allow for larger or more intensive processing.

### Next Steps

- Search for books

- Pretty banner

- Alert on clearing chat


## Demo

https://character-study-gutenberg.vercel.app/

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`.env`

`DATABASE_URL` - postgres db url

`.env.local`

`GEMINI_API_KEY` - gemini api key

## Elaboration

[Video of me explaining](https://linktodocumentation)

## Installation and Running

- Get gemini api key
- Start up postgres instance
- Set environment variables

Install Dependencies

```bash
  yarn
```

Run

```bash
  yarn dev
```
