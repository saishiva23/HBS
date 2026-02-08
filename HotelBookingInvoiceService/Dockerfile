# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy csproj and restore dependencies
COPY InvoiceService/InvoiceService.csproj InvoiceService/
RUN dotnet restore InvoiceService/InvoiceService.csproj

# Copy everything else and build
COPY InvoiceService/. InvoiceService/
WORKDIR /src/InvoiceService
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine

WORKDIR /app

# Install dependencies for QuestPDF (fonts and graphics libraries)
RUN apk add --no-cache \
    libgdiplus \
    fontconfig \
    ttf-dejavu

# Create non-root user
RUN addgroup -S dotnet && adduser -S dotnet -G dotnet

# Copy published app from build stage
COPY --from=build /app/publish .

# Change ownership
RUN chown -R dotnet:dotnet /app

# Switch to non-root user
USER dotnet:dotnet

# Expose port
EXPOSE 5000

# Environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "InvoiceService.dll"]
