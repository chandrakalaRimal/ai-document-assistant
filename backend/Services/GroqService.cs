using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace smartlife.Api.Services;

public class GroqService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GroqService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> AskAsync(
        string question,
        string context)
    {
        var apiKey =
            _configuration["Groq:ApiKey"];

        var model =
            _configuration["Groq:Model"]
            ?? "openai/gpt-oss-20b";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new Exception(
                "Groq API key is missing."
            );
        }

        var systemPrompt = """
        You are a document question-answering assistant.

        Answer the user's question using ONLY the document
        context provided to you.

        Do not use outside knowledge.

        If the answer cannot be found in the provided context,
        respond with:

        "I couldn't find enough information in the uploaded
        documents to answer that question."

        Keep the answer clear and concise.
        """;

        var userPrompt = $"""
        DOCUMENT CONTEXT:

        {context}

        USER QUESTION:

        {question}
        """;

        var body = new
        {
            model,

            messages = new[]
            {
                new
                {
                    role = "system",
                    content = systemPrompt
                },

                new
                {
                    role = "user",
                    content = userPrompt
                }
            },

            temperature = 0.1
        };

        var json =
            JsonSerializer.Serialize(body);

        using var request =
            new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.groq.com/openai/v1/chat/completions"
            );

        request.Headers.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                apiKey
            );

        request.Content =
            new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

        var response =
            await _httpClient.SendAsync(request);

        var responseJson =
            await response.Content
                .ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"Groq API error: {responseJson}"
            );
        }

        using var jsonDocument =
            JsonDocument.Parse(responseJson);

        return jsonDocument.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?? string.Empty;
    }
}