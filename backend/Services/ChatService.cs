using smartlife.Api.Models;

namespace smartlife.Api.Services;

public class ChatService
{
    private readonly EmbeddingService _embeddingService;
    private readonly QdrantService _qdrantService;
    private readonly GroqService _groqService;

    public ChatService(
        EmbeddingService embeddingService,
        QdrantService qdrantService,
        GroqService groqService)
    {
        _embeddingService = embeddingService;
        _qdrantService = qdrantService;
        _groqService = groqService;
    }

    public async Task<ChatResponse> AskAsync(
        string question)
    {
        // STEP 1:
        // Convert the question into a vector
        var questionEmbedding =
            _embeddingService
                .GenerateEmbedding(question);

        // STEP 2:
        // Search Qdrant for the most relevant
        // document chunks
        var searchResults =
            await _qdrantService.SearchAsync(
                questionEmbedding,
                limit: 5
            );

        if (searchResults.Count == 0)
        {
            return new ChatResponse
            {
                Answer =
                    "I couldn't find relevant information in the uploaded documents."
            };
        }

        // STEP 3:
        // Combine the retrieved chunks
        // into context for Groq
        var contextParts =
            searchResults.Select(
                (result, index) =>
                $"""
                SOURCE {index + 1}
                File: {result.FileName}
                Page: {result.PageNumber}

                {result.Text}
                """
            );

        var context =
            string.Join(
                "\n\n----------------\n\n",
                contextParts
            );

        // STEP 4:
        // Ask Groq to answer using
        // only that context
        var answer =
            await _groqService.AskAsync(
                question,
                context
            );

        // STEP 5:
        // Return answer + sources
        return new ChatResponse
        {
            Answer = answer,

            Sources = searchResults
                .Select(result =>
                    new SourceResponse
                    {
                        FileName =
                            result.FileName,

                        PageNumber =
                            result.PageNumber,

                        Score =
                            result.Score
                    }
                )
                .ToList()
        };
    }
}