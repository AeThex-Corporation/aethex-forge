# AeThex Game Integration Guide

This guide covers how to integrate AeThex authentication with game engines: Roblox, Unity, Unreal Engine, and Godot.

## Table of Contents

1. [Overview](#overview)
2. [Roblox Integration](#roblox-integration)
3. [Unity Integration](#unity-integration)
4. [Unreal Engine Integration](#unreal-engine-integration)
5. [Godot Integration](#godot-integration)
6. [API Reference](#api-reference)

---

## Overview

AeThex provides a unified authentication system for games to:

- Authenticate players across different platforms
- Link player accounts to Roblox, Ethereum wallets, and other providers
- Store player profiles and achievements
- Enable cross-game functionality

### Authentication Flow

1. Game requests authentication via `/api/games/game-auth`
2. Player ID verified or new user created
3. Session token returned for in-game use
4. Token can be verified via `/api/games/verify-token`
5. Player data available through secure endpoints

---

## Roblox Integration

### Setup

1. Install the AeThex Roblox plugin in Studio
2. Configure with your API credentials
3. Initialize authentication on game load

### Code Example

```lua
-- In a LocalScript or ModuleScript
local AethexAuth = {}
local API_BASE = "https://aethex.dev/api"

function AethexAuth:authenticate(playerId, playerName)
    local body = game:GetService("HttpService"):JSONEncode({
        game = "roblox",
        player_id = tostring(playerId),
        player_name = playerName,
        platform = "PC"
    })

    local response = game:GetService("HttpService"):PostAsync(
        API_BASE .. "/games/game-auth",
        body,
        Enum.HttpContentType.ApplicationJson
    )

    local data = game:GetService("HttpService"):JSONDecode(response)
    return data
end

function AethexAuth:verifyToken(sessionToken)
    local response = game:GetService("HttpService"):PostAsync(
        API_BASE .. "/games/verify-token",
        game:GetService("HttpService"):JSONEncode({
            session_token = sessionToken,
            game = "roblox"
        }),
        Enum.HttpContentType.ApplicationJson
    )

    return game:GetService("HttpService"):JSONDecode(response)
end

return AethexAuth
```

### Player Authentication

```lua
local Players = game:GetService("Players")
local AethexAuth = require(game.ServerScriptService:WaitForChild("AethexAuth"))

Players.PlayerAdded:Connect(function(player)
    local authResult = AethexAuth:authenticate(player.UserId, player.Name)

    if authResult.success then
        player:SetAttribute("AethexSessionToken", authResult.session_token)
        player:SetAttribute("AethexUserId", authResult.user_id)
        print("Player " .. player.Name .. " authenticated with AeThex")
    else
        print("Authentication failed:", authResult.error)
    end
end)
```

---

## Unity Integration

### Installation

1. Import AeThex SDK package into your Unity project
2. Add API credentials to project settings

### C# Example

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class AethexAuth : MonoBehaviour
{
    private const string API_BASE = "https://aethex.dev/api";

    [System.Serializable]
    public class AuthResponse
    {
        public bool success;
        public string session_token;
        public string user_id;
        public string username;
        public int expires_in;
        public string error;
    }

    public static IEnumerator AuthenticatePlayer(
        string playerId,
        string playerName,
        System.Action<AuthResponse> callback)
    {
        var request = new UnityWebRequest(
            $"{API_BASE}/games/game-auth",
            "POST"
        );

        var requestBody = new AuthRequest
        {
            game = "unity",
            player_id = playerId,
            player_name = playerName,
            platform = "PC"
        };

        string jsonBody = JsonUtility.ToJson(requestBody);
        request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(jsonBody));
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            var response = JsonUtility.FromJson<AuthResponse>(request.downloadHandler.text);
            callback(response);
        }
        else
        {
            callback(new AuthResponse { error = request.error });
        }
    }

    [System.Serializable]
    private class AuthRequest
    {
        public string game;
        public string player_id;
        public string player_name;
        public string platform;
    }
}
```

### Usage

```csharp
public class GameManager : MonoBehaviour
{
    void Start()
    {
        string playerId = SystemInfo.deviceUniqueIdentifier;
        string playerName = "UnityPlayer_" + Random.Range(1000, 9999);

        StartCoroutine(AethexAuth.AuthenticatePlayer(playerId, playerName, OnAuthComplete));
    }

    void OnAuthComplete(AethexAuth.AuthResponse response)
    {
        if (response.success)
        {
            Debug.Log($"Authenticated as {response.username}");
            // Store token for future requests
            PlayerPrefs.SetString("AethexSessionToken", response.session_token);
            PlayerPrefs.SetString("AethexUserId", response.user_id);
        }
        else
        {
            Debug.LogError($"Auth failed: {response.error}");
        }
    }
}
```

---

## Unreal Engine Integration

### C++ Example

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Http.h"

class YOURPROJECT_API FAethexAuth
{
public:
    struct FAuthResponse
    {
        bool bSuccess;
        FString SessionToken;
        FString UserId;
        FString Username;
        int32 ExpiresIn;
        FString Error;
    };

    static void AuthenticatePlayer(
        const FString& PlayerId,
        const FString& PlayerName,
        TFunction<void(const FAuthResponse&)> OnComplete);

private:
    static void OnAuthResponse(
        FHttpRequestPtr Request,
        FHttpResponsePtr Response,
        bool bWasSuccessful,
        TFunction<void(const FAuthResponse&)> OnComplete);
};
```

### Implementation

```cpp
#include "AethexAuth.h"
#include "Http.h"
#include "Json.h"

void FAethexAuth::AuthenticatePlayer(
    const FString& PlayerId,
    const FString& PlayerName,
    TFunction<void(const FAuthResponse&)> OnComplete)
{
    FHttpModule& HttpModule = FHttpModule::Get();
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request =
        HttpModule.CreateRequest();

    Request->SetURL(TEXT("https://aethex.dev/api/games/game-auth"));
    Request->SetVerb(TEXT("POST"));
    Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));

    // Create JSON body
    TSharedPtr<FJsonObject> JsonObject = MakeShareable(new FJsonObject());
    JsonObject->SetStringField(TEXT("game"), TEXT("unreal"));
    JsonObject->SetStringField(TEXT("player_id"), PlayerId);
    JsonObject->SetStringField(TEXT("player_name"), PlayerName);
    JsonObject->SetStringField(TEXT("platform"), TEXT("PC"));

    FString OutputString;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&OutputString);
    FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

    Request->SetContentAsString(OutputString);

    Request->OnProcessRequestComplete().BindStatic(
        &FAethexAuth::OnAuthResponse,
        OnComplete);

    Request->ProcessRequest();
}

void FAethexAuth::OnAuthResponse(
    FHttpRequestPtr Request,
    FHttpResponsePtr Response,
    bool bWasSuccessful,
    TFunction<void(const FAuthResponse&)> OnComplete)
{
    FAuthResponse AuthResponse;

    if (bWasSuccessful && Response.IsValid())
    {
        TSharedPtr<FJsonObject> JsonObject;
        TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Response->GetContentAsString());

        if (FJsonSerializer::Deserialize(Reader, JsonObject) && JsonObject.IsValid())
        {
            AuthResponse.bSuccess = JsonObject->GetBoolField(TEXT("success"));
            AuthResponse.SessionToken = JsonObject->GetStringField(TEXT("session_token"));
            AuthResponse.UserId = JsonObject->GetStringField(TEXT("user_id"));
            AuthResponse.Username = JsonObject->GetStringField(TEXT("username"));
            AuthResponse.ExpiresIn = JsonObject->GetIntegerField(TEXT("expires_in"));
        }
    }
    else
    {
        AuthResponse.Error = TEXT("Authentication request failed");
    }

    OnComplete(AuthResponse);
}
```

---

## Godot Integration

### GDScript Example

```gdscript
extends Node

const API_BASE = "https://aethex.dev/api"

func authenticate_player(player_id: String, player_name: String) -> Dictionary:
    var http_request = HTTPRequest.new()
    add_child(http_request)

    var url = API_BASE + "/games/game-auth"
    var headers = ["Content-Type: application/json"]

    var body = {
        "game": "godot",
        "player_id": player_id,
        "player_name": player_name,
        "platform": OS.get_name()
    }

    var response = http_request.request(
        url,
        headers,
        HTTPClient.METHOD_POST,
        JSON.stringify(body)
    )

    if response != OK:
        return {"error": "Request failed"}

    var result = await http_request.request_completed

    if result[1] != 200:
        return {"error": "Authentication failed"}

    var response_data = JSON.parse_string(result[3].get_string_from_utf8())
    http_request.queue_free()

    return response_data

func verify_token(session_token: String) -> Dictionary:
    var http_request = HTTPRequest.new()
    add_child(http_request)

    var url = API_BASE + "/games/verify-token"
    var headers = ["Content-Type: application/json"]

    var body = {
        "session_token": session_token,
        "game": "godot"
    }

    var response = http_request.request(
        url,
        headers,
        HTTPClient.METHOD_POST,
        JSON.stringify(body)
    )

    var result = await http_request.request_completed
    var response_data = JSON.parse_string(result[3].get_string_from_utf8())
    http_request.queue_free()

    return response_data

func _ready():
    var player_id = OS.get_unique_id()
    var player_name = "GodotPlayer_" + str(randi_range(1000, 9999))

    var auth_result = await authenticate_player(player_id, player_name)

    if auth_result.has("success") and auth_result["success"]:
        print("Authenticated as: ", auth_result["username"])
        # Store token
        var player = get_tree().root.get_node("GameManager")
        player.aethex_session_token = auth_result["session_token"]
    else:
        print("Authentication failed: ", auth_result.get("error", "Unknown error"))
```

---

## API Reference

### Endpoints

#### `POST /api/games/game-auth`

Authenticate a game player and create a session.

**Request:**

```json
{
  "game": "unity|unreal|godot|roblox|custom",
  "player_id": "unique-player-id",
  "player_name": "player-display-name",
  "device_id": "optional-device-id",
  "platform": "PC|Mobile|Console"
}
```

**Response:**

```json
{
  "success": true,
  "session_token": "token-string",
  "user_id": "uuid",
  "username": "username",
  "game": "unity",
  "expires_in": 604800,
  "api_base_url": "https://aethex.dev/api",
  "docs_url": "https://docs.aethex.dev/game-integration"
}
```

#### `POST /api/games/verify-token`

Verify a game session token and get player data.

**Request:**

```json
{
  "session_token": "token-string",
  "game": "unity"
}
```

**Response:**

```json
{
  "valid": true,
  "user_id": "uuid",
  "username": "username",
  "email": "user@example.com",
  "full_name": "Player Name",
  "game": "unity",
  "platform": "PC",
  "expires_at": "2025-01-15T10:30:00Z"
}
```

### Error Codes

- `400`: Missing required fields
- `401`: Invalid or expired token
- `403`: Token not valid for specified game
- `500`: Server error

---

## Support

For issues or questions, visit:

- Docs: https://docs.aethex.dev
- Discord: https://discord.gg/aethex
- Email: support@aethex.tech
