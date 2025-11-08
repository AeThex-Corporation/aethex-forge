/**
 * Creator Network API Test Suite
 * Phase 2: Backend API Integration Tests
 */

interface TestResult {
  endpoint: string;
  method: string;
  status: "✓" | "✗";
  statusCode?: number;
  message: string;
  error?: any;
}

const results: TestResult[] = [];
const baseUrl = "http://localhost:5173";

const log = (result: TestResult) => {
  results.push(result);
  const symbol = result.status === "✓" ? "✓" : "✗";
  console.log(
    `${symbol} ${result.method.padEnd(6)} ${result.endpoint.padEnd(40)} - ${result.message}`,
  );
};

const testEndpoint = async (
  method: string,
  endpoint: string,
  body?: any,
): Promise<any> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();

    return { response, data };
  } catch (error) {
    throw error;
  }
};

async function runTests() {
  console.log("🚀 Creator Network API Test Suite\n");

  // Test 1: Get creators (should return empty or existing creators)
  try {
    const { response, data } = await testEndpoint(
      "GET",
      "/api/creators?page=1&limit=10",
    );
    if (response.ok) {
      log({
        endpoint: "/api/creators",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: `Retrieved creators - ${data.data?.length || 0} results`,
      });
    } else {
      log({
        endpoint: "/api/creators",
        method: "GET",
        status: "✗",
        statusCode: response.status,
        message: `Error: ${data.error || response.statusText}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/creators",
      method: "GET",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 2: Get creator by username (should fail - user doesn't exist yet)
  try {
    const { response, data } = await testEndpoint(
      "GET",
      "/api/creators/testuser123",
    );
    if (response.status === 404) {
      log({
        endpoint: "/api/creators/:username",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: "Correctly returned 404 for non-existent user",
      });
    } else if (response.ok) {
      log({
        endpoint: "/api/creators/:username",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: `Retrieved creator: ${data.username}`,
      });
    } else {
      log({
        endpoint: "/api/creators/:username",
        method: "GET",
        status: "✗",
        statusCode: response.status,
        message: `Unexpected error: ${data.error}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/creators/:username",
      method: "GET",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 3: Create creator (validation test)
  try {
    const { response, data } = await testEndpoint("POST", "/api/creators", {
      user_id: "test-user-123",
      username: "test-creator",
      bio: "Test creator bio",
      avatar_url: "https://example.com/avatar.jpg",
      experience_level: "intermediate",
      primary_arm: "gameforge",
      arm_affiliations: ["gameforge", "labs"],
      skills: ["react", "typescript"],
    });

    if (response.status === 201) {
      log({
        endpoint: "/api/creators",
        method: "POST",
        status: "✓",
        statusCode: response.status,
        message: `Created creator: ${data.username}`,
      });
    } else if (response.status === 400 && data.error?.includes("already")) {
      log({
        endpoint: "/api/creators",
        method: "POST",
        status: "✓",
        statusCode: response.status,
        message: "Duplicate username validation works",
      });
    } else {
      log({
        endpoint: "/api/creators",
        method: "POST",
        status: response.ok || response.status === 400 ? "✓" : "✗",
        statusCode: response.status,
        message: data.error || "Created successfully",
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/creators",
      method: "POST",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 4: Get opportunities (should return empty or existing)
  try {
    const { response, data } = await testEndpoint(
      "GET",
      "/api/opportunities?page=1&limit=10",
    );
    if (response.ok) {
      log({
        endpoint: "/api/opportunities",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: `Retrieved opportunities - ${data.data?.length || 0} results`,
      });
    } else {
      log({
        endpoint: "/api/opportunities",
        method: "GET",
        status: "✗",
        statusCode: response.status,
        message: `Error: ${data.error || response.statusText}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/opportunities",
      method: "GET",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 5: Get opportunity by ID (should fail - doesn't exist yet)
  try {
    const { response, data } = await testEndpoint(
      "GET",
      "/api/opportunities/fake-id-123",
    );
    if (response.status === 404) {
      log({
        endpoint: "/api/opportunities/:id",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: "Correctly returned 404 for non-existent opportunity",
      });
    } else {
      log({
        endpoint: "/api/opportunities/:id",
        method: "GET",
        status: "✗",
        statusCode: response.status,
        message: `Unexpected response: ${data.error}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/opportunities/:id",
      method: "GET",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 6: Create opportunity (without creator profile - should fail)
  try {
    const { response, data } = await testEndpoint(
      "POST",
      "/api/opportunities",
      {
        user_id: "non-existent-user",
        title: "Test Opportunity",
        description: "A test job opportunity",
        job_type: "contract",
        arm_affiliation: "gameforge",
      },
    );

    if (response.status === 404) {
      log({
        endpoint: "/api/opportunities",
        method: "POST",
        status: "✓",
        statusCode: response.status,
        message: "Correctly requires creator profile",
      });
    } else {
      log({
        endpoint: "/api/opportunities",
        method: "POST",
        status: "✗",
        statusCode: response.status,
        message: `Expected 404, got: ${data.error}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/opportunities",
      method: "POST",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 7: Get applications (missing user_id parameter)
  try {
    const { response, data } = await testEndpoint("GET", "/api/applications");

    if (response.status === 400) {
      log({
        endpoint: "/api/applications",
        method: "GET",
        status: "✓",
        statusCode: response.status,
        message: "Correctly validates required parameters",
      });
    } else {
      log({
        endpoint: "/api/applications",
        method: "GET",
        status: "✗",
        statusCode: response.status,
        message: `Expected validation error, got: ${data.error}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/applications",
      method: "GET",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Test 8: DevConnect link endpoint
  try {
    const { response, data } = await testEndpoint(
      "POST",
      "/api/devconnect/link",
      {
        user_id: "test-user-123",
        devconnect_username: "testuser",
      },
    );

    if (response.status === 404) {
      log({
        endpoint: "/api/devconnect/link",
        method: "POST",
        status: "✓",
        statusCode: response.status,
        message: "Correctly requires creator profile",
      });
    } else if (response.status === 201 || response.status === 200) {
      log({
        endpoint: "/api/devconnect/link",
        method: "POST",
        status: "✓",
        statusCode: response.status,
        message: "DevConnect link created/updated",
      });
    } else {
      log({
        endpoint: "/api/devconnect/link",
        method: "POST",
        status: "✗",
        statusCode: response.status,
        message: `Unexpected response: ${data.error}`,
      });
    }
  } catch (error: any) {
    log({
      endpoint: "/api/devconnect/link",
      method: "POST",
      status: "✗",
      message: `Connection error: ${error.message}`,
      error,
    });
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  const passed = results.filter((r) => r.status === "✓").length;
  const failed = results.filter((r) => r.status === "✗").length;
  console.log(
    `\nTest Summary: ${passed} passed, ${failed} failed out of ${results.length} tests`,
  );

  if (failed > 0) {
    console.log("\n❌ Failed tests:");
    results
      .filter((r) => r.status === "✗")
      .forEach((r) => {
        console.log(`  - ${r.method} ${r.endpoint}: ${r.message}`);
      });
  } else {
    console.log("\n✅ All tests passed!");
  }

  console.log("\n" + "=".repeat(80));

  return { passed, failed, total: results.length };
}

// Run tests
runTests().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
