FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY smartlife.Api.csproj ./
RUN dotnet restore

COPY . .

RUN dotnet publish smartlife.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "smartlife.Api.dll"]