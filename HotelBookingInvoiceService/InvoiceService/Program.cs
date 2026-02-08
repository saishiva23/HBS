using InvoiceService.Settings;
using InvoiceService.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure to use HTTP only
builder.WebHost.UseUrls("http://localhost:5000");

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Email Service Configuration
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "Invoice Service is running! POST to /api/invoice/generate");

app.MapGet("/health", () => new { 
    status = "healthy", 
    service = "Invoice & Email Service",
    timestamp = DateTime.UtcNow,
    endpoints = new[] {
        "POST /api/invoice/generate - Generate and send invoice PDF",
        "POST /api/email/send-invoice - Send invoice email separately",
        "GET /health - Health check"
    }
});

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
