namespace smartlife.Api.Models;

public class DocumentChunk
{
    public string DocumentId { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public int PageNumber { get; set; }

    public int ChunkIndex { get; set; }

    public string Text { get; set; } = string.Empty;

    public float[] Embedding { get; set; } = [];
}