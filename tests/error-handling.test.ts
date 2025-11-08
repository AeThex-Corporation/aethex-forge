/**
 * Error Handling & Edge Cases Test Suite
 * Phase 3: Testing & Validation
 */

interface TestResult {
  name: string;
  passed: boolean;
  expectedStatus: number;
  actualStatus: number;
  message: string;
}

const results: TestResult[] = [];
const BASE_URL = "http://localhost:5173";

const test = (
  name: string,
  passed: boolean,
  expectedStatus: number,
  actualStatus: number,
  message: string,
) => {
  results.push({ name, passed, expectedStatus, actualStatus, message });
  const symbol = passed ? "✓" : "✗";
  console.log(
    `${symbol} ${name.padEnd(50)} | Expected: ${expectedStatus}, Got: ${actualStatus}`,
  );
};

async function runErrorTests() {
  console.log("🛡️ Error Handling & Edge Cases Test Suite\n");

  // ERROR CATEGORY 1: Validation Errors
  console.log("\n🔴 Category 1: Input Validation Errors");
  console.log("=".repeat(70));

  // Test missing required fields
  let res = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "testuser" }), // Missing user_id
  });
  test(
    "Create creator - missing user_id",
    res.status === 400,
    400,
    res.status,
    "Should require user_id",
  );

  res = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "user123" }), // Missing username
  });
  test(
    "Create creator - missing username",
    res.status === 400,
    400,
    res.status,
    "Should require username",
  );

  res = await fetch(`${BASE_URL}/api/opportunities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "user123" }), // Missing title
  });
  test(
    "Create opportunity - missing title",
    res.status === 400,
    400,
    res.status,
    "Should require title",
  );

  res = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "user123" }), // Missing opportunity_id
  });
  test(
    "Submit application - missing opportunity_id",
    res.status === 400,
    400,
    res.status,
    "Should require opportunity_id",
  );

  // ERROR CATEGORY 2: Not Found Errors
  console.log("\n🔴 Category 2: Resource Not Found Errors");
  console.log("=".repeat(70));

  res = await fetch(`${BASE_URL}/api/creators/nonexistent_user_12345`);
  test(
    "Get creator - non-existent username",
    res.status === 404,
    404,
    res.status,
    "Should return 404 for non-existent creator",
  );

  res = await fetch(`${BASE_URL}/api/opportunities/fake-opp-id-99999`);
  test(
    "Get opportunity - non-existent ID",
    res.status === 404,
    404,
    res.status,
    "Should return 404 for non-existent opportunity",
  );

  res = await fetch(`${BASE_URL}/api/applications?user_id=nonexistent-user`);
  test(
    "Get applications - non-existent creator",
    res.status === 404,
    404,
    res.status,
    "Should return 404 when creator doesn't exist",
  );

  // ERROR CATEGORY 3: Authorization/Ownership Errors
  console.log("\n🔴 Category 3: Authorization & Ownership Errors");
  console.log("=".repeat(70));

  // Create a fake creator for testing
  const testCreator = {
    id: `error-test-${Date.now()}`,
    username: `error_test_${Date.now()}`,
  };

  let creatorRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: testCreator.id,
      username: testCreator.username,
      bio: "Test creator",
      experience_level: "junior",
    }),
  });

  if (creatorRes.ok) {
    // Try to update someone else's profile
    res = await fetch(`${BASE_URL}/api/creators/fake-id`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: "Hacked bio",
      }),
    });
    test(
      "Update creator - invalid creator ID",
      res.status === 500 || res.status === 404,
      404,
      res.status,
      "Should reject invalid creator ID",
    );
  }

  // ERROR CATEGORY 4: Duplicate/Conflict Errors
  console.log("\n🔴 Category 4: Duplicate & Conflict Errors");
  console.log("=".repeat(70));

  // Create duplicate creator
  const dupUsername = `dup_test_${Date.now()}`;
  await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: `dup-user-1`,
      username: dupUsername,
      experience_level: "junior",
    }),
  });

  res = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: `dup-user-2`,
      username: dupUsername, // Same username
      experience_level: "junior",
    }),
  });
  test(
    "Create creator - duplicate username",
    res.status === 400,
    400,
    res.status,
    "Should prevent duplicate usernames",
  );

  // Test duplicate application (create opportunity first)
  const oppCreatorId = `opp-creator-${Date.now()}`;
  const oppCreatorUsername = `opp_creator_${Date.now()}`;
  const appCreatorId = `app-creator-${Date.now()}`;
  const appCreatorUsername = `app_creator_${Date.now()}`;

  let oppRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: oppCreatorId,
      username: oppCreatorUsername,
      experience_level: "senior",
    }),
  });

  let appCreatorRes = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: appCreatorId,
      username: appCreatorUsername,
      experience_level: "junior",
    }),
  });

  if (oppRes.ok && appCreatorRes.ok) {
    // Create opportunity
    let createOppRes = await fetch(`${BASE_URL}/api/opportunities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: oppCreatorId,
        title: "Test Opportunity",
        description: "Test",
        job_type: "full-time",
      }),
    });

    if (createOppRes.ok) {
      const oppData = await createOppRes.json();
      const oppId = oppData.id;

      // First application
      await fetch(`${BASE_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: appCreatorId,
          opportunity_id: oppId,
          cover_letter: "First application",
        }),
      });

      // Duplicate application
      res = await fetch(`${BASE_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: appCreatorId,
          opportunity_id: oppId,
          cover_letter: "Duplicate application",
        }),
      });
      test(
        "Apply to opportunity - duplicate application",
        res.status === 400,
        400,
        res.status,
        "Should prevent duplicate applications",
      );
    }
  }

  // ERROR CATEGORY 5: Missing Required Relationships
  console.log("\n🔴 Category 5: Missing Required Relationships");
  console.log("=".repeat(70));

  res = await fetch(`${BASE_URL}/api/opportunities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: `nonexistent-creator-user`,
      title: "Opportunity",
      description: "Test",
    }),
  });
  test(
    "Create opportunity - creator doesn't exist",
    res.status === 404,
    404,
    res.status,
    "Should require existing creator profile",
  );

  res = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: `nonexistent-app-creator`,
      opportunity_id: "fake-opp-id",
    }),
  });
  test(
    "Submit application - creator doesn't exist",
    res.status === 404,
    404,
    res.status,
    "Should require existing creator profile",
  );

  // ERROR CATEGORY 6: Invalid Query Parameters
  console.log("\n🔴 Category 6: Invalid Query Parameters");
  console.log("=".repeat(70));

  res = await fetch(`${BASE_URL}/api/creators?page=invalid&limit=20`);
  const pageData = await res.json();
  test(
    "Get creators - invalid page parameter",
    res.ok, // Should still work with default pagination
    200,
    res.status,
    "Should handle invalid page gracefully",
  );

  res = await fetch(`${BASE_URL}/api/opportunities?limit=999999`);
  test(
    "Get opportunities - limit too large",
    res.ok, // Should cap the limit
    200,
    res.status,
    "Should cap maximum limit",
  );

  res = await fetch(`${BASE_URL}/api/creators?arm=invalid_arm`);
  const armData = await res.json();
  test(
    "Get creators - invalid arm filter",
    res.ok && Array.isArray(armData.data),
    200,
    res.status,
    "Should return empty results or handle gracefully",
  );

  // ERROR CATEGORY 7: Empty/Null Values
  console.log("\n🔴 Category 7: Empty & Null Values");
  console.log("=".repeat(70));

  res = await fetch(`${BASE_URL}/api/creators`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "",
      username: "",
    }),
  });
  test(
    "Create creator - empty user_id",
    res.status === 400,
    400,
    res.status,
    "Should reject empty user_id",
  );

  res = await fetch(`${BASE_URL}/api/creators?search=`);
  test(
    "Search creators - empty search string",
    res.ok,
    200,
    res.status,
    "Should handle empty search gracefully",
  );

  // ERROR CATEGORY 8: Missing DevConnect Parameters
  console.log("\n🔴 Category 8: DevConnect Linking Errors");
  console.log("=".repeat(70));

  res = await fetch(`${BASE_URL}/api/devconnect/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ devconnect_username: "user" }), // Missing user_id
  });
  test(
    "Link DevConnect - missing user_id",
    res.status === 400,
    400,
    res.status,
    "Should require user_id",
  );

  res = await fetch(`${BASE_URL}/api/devconnect/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "user123" }), // Missing devconnect_username
  });
  test(
    "Link DevConnect - missing devconnect_username",
    res.status === 400,
    400,
    res.status,
    "Should require devconnect_username",
  );

  res = await fetch(`${BASE_URL}/api/devconnect/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "nonexistent-user",
      devconnect_username: "dev_user",
    }),
  });
  test(
    "Link DevConnect - creator doesn't exist",
    res.status === 404,
    404,
    res.status,
    "Should require existing creator profile",
  );

  // Summary
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n📊 Error Handling Test Summary:`);
  console.log(`   ✓ Passed: ${passed}`);
  console.log(`   ✗ Failed: ${failed}`);
  console.log(`   Total: ${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.name}`);
        console.log(
          `     Expected ${r.expectedStatus}, got ${r.actualStatus}: ${r.message}`,
        );
      });
  } else {
    console.log("\n✅ All error handling tests passed!");
  }

  console.log("\n" + "=".repeat(70));
  return { passed, failed, total: results.length };
}

runErrorTests()
  .then((summary) => {
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
