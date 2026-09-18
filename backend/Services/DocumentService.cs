using smartlife.Api.Models;
using UglyToad.PdfPig;

namespace smartlife.Api.Services;

public class DocumentService
{
    private readonly EmbeddingService _embeddingService;
    private readonly QdrantService _qdrantService;
    private readonly TextChunker _textChunker;

    public DocumentService(
        EmbeddingService embeddingService,
        QdrantService qdrantService,
        TextChunker textChunker)
    {
        _embeddingService = embeddingService;
        _qdrantService = qdrantService;
        _textChunker = textChunker;
    }

    public async Task<object> ProcessDocumentAsync(
        IFormFile file)
    {
        var documentId = Guid.NewGuid().ToString();

        var allChunks =
            new List<DocumentChunk>();

        using var stream = file.OpenReadStream();

        using var document =
            PdfDocument.Open(stream);

        var chunkIndex = 0;

        foreach (var page in document.GetPages())
        {
            var pageText = page.Text;

            if (string.IsNullOrWhiteSpace(pageText))
                continue;

            var textChunks =
                _textChunker.Split(pageText);

            foreach (var textChunk in textChunks)
            {
                var embedding =
                    _embeddingService
                        .GenerateEmbedding(textChunk);

                allChunks.Add(
                    new DocumentChunk
                    {
                        DocumentId = documentId,

                        FileName = file.FileName,

                        PageNumber = page.Number,

                        ChunkIndex = chunkIndex,

                        Text = textChunk,

                        Embedding = embedding
                    }
                );

                chunkIndex++;
            }
        }

        await _qdrantService
            .StoreChunksAsync(allChunks);

        return new
        {
            documentId,
            fileName = file.FileName,
            pages = document.NumberOfPages,
            chunks = allChunks.Count,
            message = "Document processed successfully."
        };
    }
}