namespace smartlife.Api.Models;

public class ChatResponse
{
    public string Answer { get; set; } = string.Empty;

    public List<SourceResponse> Sources { get; set; } = [];
}

public class SourceResponse
{
    public string FileName { get; set; } = string.Empty;

    public int PageNumber { get; set; }

    public float Score { get; set; }
}