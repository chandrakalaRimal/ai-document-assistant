using SmartComponents.LocalEmbeddings;

namespace smartlife.Api.Services;

public class EmbeddingService
{
    private readonly LocalEmbedder _embedder;

    public EmbeddingService(LocalEmbedder embedder)
    {
        _embedder = embedder;
    }

    public float[] GenerateEmbedding(string text)
    {
        var embedding =
            _embedder.Embed<EmbeddingF32>(text);

        return embedding.Values.ToArray();
    }
}