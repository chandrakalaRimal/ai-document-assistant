using smartlife.Api.Services;
using SmartComponents.LocalEmbeddings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Local embedding model
// Singleton because loading the model is expensive.
builder.Services.AddSingleton<LocalEmbedder>();

builder.Services.AddSingleton<EmbeddingService>();
builder.Services.AddSingleton<QdrantService>();
builder.Services.AddSingleton<TextChunker>();

builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<ChatService>();


// Groq uses HttpClient
builder.Services.AddHttpClient<GroqService>();


// React will run separately
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("Frontend");

app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        service = "AI Document Assistant API"
    });
});

app.MapControllers();


app.Run();