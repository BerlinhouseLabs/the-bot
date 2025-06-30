import { z } from 'zod';

export const QA_RESPONSE_SCHEMA = z
  .object({
    answer: z
      .string()
      .describe("The final, synthesized answer to the user's query."),

    source_type: z
      .enum(['Notion Knowledge Base', 'Vector Database'])
      .describe(
        'The type of data source used to generate the answer, as determined by the system.',
      ),

    source_document: z
      .string()
      .describe(
        "The specific source document, page, or identifier from which the information was retrieved (e.g., 'FAQ Page', 'Document ID: 12345', 'Guide to X').",
      ),

    confidence_score: z
      .number()
      .describe(
        "The model's overall confidence in the accuracy of the final answer, ranging from 0.0 (low) to 1.0 (high).",
      ),

    retrieval_score: z
      .number()
      .nullable()
      .describe(
        'The similarity score (e.g., cosine similarity) from the vector database search. This will be null if the Notion knowledge base was used directly.',
      ),

    tool_used: z
      .enum(['Notion Search', 'Vector Search'])
      .describe('The specific tool used to fetch the information.'),
  })
  .describe(
    'A structured output for a Q&A bot that uses Retrieval-Augmented Generation (RAG). It provides the answer, the source of the information, confidence levels, and other relevant metadata for traceability and evaluation.',
  );

export type QA_RESPONSE = z.infer<typeof QA_RESPONSE_SCHEMA>;
