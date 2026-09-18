using smartlife.Api.Models;
using smartlife.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace smartlife.Api.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(
        ChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public async Task<IActionResult> Ask(
        [FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(
                request.Question))
        {
            return BadRequest(
                "Question is required."
            );
        }

        var response =
            await _chatService
                .AskAsync(request.Question);

        return Ok(response);
    }
}