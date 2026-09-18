
using smartlife.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace smartlife.Api.Controllers;

[ApiController]
[Route("api/documents")]
public class DocumentsController : ControllerBase
{
    private readonly DocumentService _documentService;

    public DocumentsController(
        DocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(
        IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(
                "Please select a PDF file."
            );
        }

        if (!file.FileName.EndsWith(
                ".pdf",
                StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(
                "Only PDF files are supported."
            );
        }

        var result =
            await _documentService
                .ProcessDocumentAsync(file);

        return Ok(result);
    }
}