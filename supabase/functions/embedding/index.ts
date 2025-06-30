import { createClient } from 'npm:@supabase/supabase-js@2';
import { AzureOpenAIEmbeddings } from 'npm:@langchain/openai';
import type { Document } from 'npm:@langchain/core/documents';
import { SupabaseVectorStore } from 'npm:@langchain/community/vectorstores/supabase';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const embeddings = new AzureOpenAIEmbeddings({
  model: Deno.env.get('EMBEDDING_MODEL')!,
});

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabase,
  tableName: 'documents',
  queryName: 'match_documents',
});

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    const { data, error } = await supabase.storage
      .from('notion')
      .download(body.record.name);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to download file' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const contents = await data.text();

    const document: Document = {
      pageContent: contents,
      metadata: { source: body.record.name },
    };

    await vectorStore.addDocuments([document]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to process webhook' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
