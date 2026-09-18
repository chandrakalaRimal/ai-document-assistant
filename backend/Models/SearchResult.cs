namespace smartlife.Api.Models;

public class SearchResult
{
    public string Text { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public int PageNumber { get; set; }

    public float Score { get; set; }
}