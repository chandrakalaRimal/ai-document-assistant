using smartlife.Api.Models;
using Qdrant.Client;
using Qdrant.Client.Grpc;

namespace smartlife.Api.Services;

public class QdrantService
{
    private const string CollectionName = "document_chunks";

    // SmartComponents local embedding = 384 dimensions
    private const ulong VectorSize = 384;

    private readonly QdrantClient _client;

    public QdrantService()
    {
        _client = new QdrantClient(
            host: "localhost",
            port: 6334
        );
    }

    public async Task EnsureCollectionAsync()
    {
        var exists =
            await _client.CollectionExistsAsync(
                CollectionName
            );

        if (exists)
            return;

        await _client.CreateCollectionAsync(
            CollectionName,
            new VectorParams
            {
                Size = VectorSize,
                Distance = Distance.Cosine
            }
        );
    }

    public async Task StoreChunksAsync(
        List<DocumentChunk> chunks)
    {
        await EnsureCollectionAsync();

        var points = chunks.Select(chunk =>
        {
            return new PointStruct
            {
                Id = Guid.NewGuid(),

                Vectors = chunk.Embedding,

                Payload =
                {
                    ["documentId"] = chunk.DocumentId,
                    ["fileName"] = chunk.FileName,
                    ["pageNumber"] = chunk.PageNumber,
                    ["chunkIndex"] = chunk.ChunkIndex,
                    ["text"] = chunk.Text
                }
            };
        }).ToList();

        await _client.UpsertAsync(
            CollectionName,
            points
        );
    }

    public async Task<List<SearchResult>> SearchAsync(
        float[] questionEmbedding,
        ulong limit = 5)
    {
        await EnsureCollectionAsync();

        var results =
            await _client.SearchAsync(
                CollectionName,
                questionEmbedding,
                limit: limit
            );

        return results.Select(result =>
            new SearchResult
            {
                Text =
                    result.Payload["text"].StringValue,

                FileName =
                    result.Payload["fileName"].StringValue,

                PageNumber =
                    (int)result.Payload["pageNumber"]
                        .IntegerValue,

                Score = result.Score
            }
        ).ToList();
    }
}