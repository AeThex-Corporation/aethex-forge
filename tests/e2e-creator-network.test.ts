/**
 * Creator Network End-to-End Test Suite
 * Phase 3: Testing & Validation
 *
 * Tests complete user flows:
 * 1. Sign up → Create creator profile
 * 2. Post opportunity → Receive applications
 * 3. Browse creators → Browse opportunities
 * 4. Apply for opportunity → Track application
 * 5. DevConnect linking
 */

interface TestCase {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

const results: TestCase[] = [];
const BASE_URL = "http://localhost:5173";

// Test utilities
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const test = (
  name: string,
  passed: boolean,
  message: string,
  duration: number = 0,
) => {
  results.push({ name, passed, message, duration });
  const symbol = passed ? "✓" : "✗";
  console.log(`${symbol} ${name}`);
  if (!passed) console.log(`  → ${message}`);
};

const assertEquals = (actual: any, expected: any, msg: string) => {
  const pass = actual === expected;
  if (!pass) {
    throw new Error(`${msg}: expected ${expected}, got ${actual}`);
  }
};

const assertExists = (value: any, msg: string) => {
  if (!value) {
    throw new Error(`${msg}: value is null or undefined`);
  }
};

const assertInRange = (
  actual: number,
  min: number,
  max: number,
  msg: string,
) => {
  if (actual < min || actual > max) {
    throw new Error(`${msg}: value ${actual} not in range [${min}, ${max}]`);
  }
};

// Test data
const testUsers = {
  creator1: {
    id: `creator-${Date.now()}-1`,
    username: `creator_${Date.now()}_1`,
    email: `creator1-${Date.now()}@test.com`,
  },
  creator2: {
    id: `creator-${Date.now()}-2`,
    username: `creator_${Date.now()}_2`,
    email: `creator2-${Date.now()}@test.com`,
  },
};

// E2E Test Flows
async function runE2ETests() {
  console.log("🚀 Creator Network End-to-End Test Suite\n");

  // FLOW 1: Creator Registration and Profile Setup
  console.log("\n📝 FLOW 1: Creator Registration & Profile Setup");
  console.log("=".repeat(50));

  try {
    // Create first creator profile
    const createCreator1Start = Date.now();
    const createRes1 = await fetch(`${BASE_URL}/api/creators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator1.id,
        username: testUsers.creator1.username,
        bio: "Experienced game developer",
        avatar_url: "https://example.com/avatar1.jpg",
        experience_level: "senior",
        primary_arm: "gameforge",
        arm_affiliations: ["gameforge", "labs"],
        skills: ["unity", "c#", "game design"],
      }),
    });
    const creator1Data = await createRes1.json();
    const createCreator1Duration = Date.now() - createCreator1Start;

    test(
      "Create creator profile 1",
      createRes1.status === 201,
      `Status: ${createRes1.status}`,
      createCreator1Duration,
    );

    if (createRes1.ok) {
      assertExists(creator1Data.id, "Creator ID should exist");
      assertEquals(
        creator1Data.username,
        testUsers.creator1.username,
        "Username mismatch",
      );
      assertEquals(
        creator1Data.primary_arm,
        "gameforge",
        "Primary arm mismatch",
      );
    }

    // Create second creator profile
    const createCreator2Start = Date.now();
    const createRes2 = await fetch(`${BASE_URL}/api/creators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator2.id,
        username: testUsers.creator2.username,
        bio: "Aspiring developer",
        avatar_url: "https://example.com/avatar2.jpg",
        experience_level: "junior",
        primary_arm: "labs",
        arm_affiliations: ["labs"],
        skills: ["javascript", "react", "web development"],
      }),
    });
    const creator2Data = await createRes2.json();
    const createCreator2Duration = Date.now() - createCreator2Start;

    test(
      "Create creator profile 2",
      createRes2.status === 201,
      `Status: ${createRes2.status}`,
      createCreator2Duration,
    );
  } catch (error: any) {
    test("Create creator profiles", false, error.message);
  }

  // FLOW 2: Opportunity Creation
  console.log("\n📋 FLOW 2: Opportunity Creation & Discovery");
  console.log("=".repeat(50));

  let opportunityId: string | null = null;

  try {
    // Creator 1 posts opportunity
    const createOppStart = Date.now();
    const oppRes = await fetch(`${BASE_URL}/api/opportunities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator1.id,
        title: "Senior Game Dev - Unity Project",
        description:
          "Looking for experienced Unity developer for 6-month contract",
        job_type: "contract",
        salary_min: 80000,
        salary_max: 120000,
        experience_level: "senior",
        arm_affiliation: "gameforge",
      }),
    });
    const oppData = await oppRes.json();
    const createOppDuration = Date.now() - createOppStart;

    test(
      "Create opportunity",
      oppRes.status === 201,
      `Status: ${oppRes.status}`,
      createOppDuration,
    );

    if (oppRes.ok) {
      opportunityId = oppData.id;
      assertExists(oppData.id, "Opportunity ID should exist");
      assertEquals(
        oppData.title,
        "Senior Game Dev - Unity Project",
        "Title mismatch",
      );
      assertEquals(oppData.status, "open", "Status should be open");
    }

    // Browse opportunities with filters
    const browseOppStart = Date.now();
    const browseRes = await fetch(
      `${BASE_URL}/api/opportunities?arm=gameforge&page=1&limit=10`,
    );
    const browseData = await browseRes.json();
    const browseOppDuration = Date.now() - browseOppStart;

    test(
      "Browse opportunities with filters",
      browseRes.ok && Array.isArray(browseData.data),
      `Status: ${browseRes.status}, Found: ${browseData.data?.length || 0}`,
      browseOppDuration,
    );

    if (browseRes.ok) {
      assertExists(browseData.pagination, "Pagination data should exist");
      assertInRange(browseOppDuration, 0, 1000, "Response time reasonable");
    }
  } catch (error: any) {
    test("Create and browse opportunities", false, error.message);
  }

  // FLOW 3: Creator Discovery
  console.log("\n👥 FLOW 3: Creator Discovery & Profiles");
  console.log("=".repeat(50));

  try {
    // Browse creators
    const browseCreatorsStart = Date.now();
    const creatorsRes = await fetch(
      `${BASE_URL}/api/creators?arm=gameforge&page=1&limit=20`,
    );
    const creatorsData = await creatorsRes.json();
    const browseCreatorsDuration = Date.now() - browseCreatorsStart;

    test(
      "Browse creators with arm filter",
      creatorsRes.ok && Array.isArray(creatorsData.data),
      `Status: ${creatorsRes.status}, Found: ${creatorsData.data?.length || 0}`,
      browseCreatorsDuration,
    );

    // Get individual creator profile
    const getCreatorStart = Date.now();
    const creatorRes = await fetch(
      `${BASE_URL}/api/creators/${testUsers.creator1.username}`,
    );
    const creatorData = await creatorRes.json();
    const getCreatorDuration = Date.now() - getCreatorStart;

    test(
      "Get creator profile by username",
      creatorRes.ok && creatorData.username === testUsers.creator1.username,
      `Status: ${creatorRes.status}, Username: ${creatorData.username}`,
      getCreatorDuration,
    );

    if (creatorRes.ok) {
      assertExists(creatorData.bio, "Bio should exist");
      assertExists(creatorData.skills, "Skills should exist");
      assertEquals(
        Array.isArray(creatorData.arm_affiliations),
        true,
        "Arm affiliations should be array",
      );
    }
  } catch (error: any) {
    test("Creator discovery and profiles", false, error.message);
  }

  // FLOW 4: Application Submission & Tracking
  console.log("\n✉️ FLOW 4: Apply for Opportunity & Track Status");
  console.log("=".repeat(50));

  let applicationId: string | null = null;

  try {
    if (!opportunityId) {
      throw new Error("Opportunity not created, cannot test applications");
    }

    // Creator 2 applies for opportunity
    const applyStart = Date.now();
    const applyRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator2.id,
        opportunity_id: opportunityId,
        cover_letter:
          "I'm very interested in this opportunity. I have 3 years of Unity experience.",
      }),
    });
    const appData = await applyRes.json();
    const applyDuration = Date.now() - applyStart;

    test(
      "Submit application",
      applyRes.status === 201,
      `Status: ${applyRes.status}`,
      applyDuration,
    );

    if (applyRes.ok) {
      applicationId = appData.id;
      assertExists(appData.id, "Application ID should exist");
      assertEquals(appData.status, "submitted", "Status should be submitted");
      assertExists(appData.applied_at, "Applied timestamp should exist");
    }

    // Duplicate application should fail
    const dupRes = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator2.id,
        opportunity_id: opportunityId,
        cover_letter: "Second attempt",
      }),
    });

    test(
      "Prevent duplicate applications",
      dupRes.status === 400,
      `Status: ${dupRes.status} (should be 400)`,
      0,
    );

    // Get applications for creator
    const getAppsStart = Date.now();
    const appsRes = await fetch(
      `${BASE_URL}/api/applications?user_id=${testUsers.creator2.id}`,
    );
    const appsData = await appsRes.json();
    const getAppsDuration = Date.now() - getAppsStart;

    test(
      "Get creator's applications",
      appsRes.ok && Array.isArray(appsData.data),
      `Status: ${appsRes.status}, Found: ${appsData.data?.length || 0}`,
      getAppsDuration,
    );

    // Update application status (as opportunity creator)
    if (applicationId) {
      const updateStart = Date.now();
      const updateRes = await fetch(
        `${BASE_URL}/api/applications/${applicationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: testUsers.creator1.id,
            status: "accepted",
            response_message: "Great! We'd love to have you on board.",
          }),
        },
      );
      const updateDuration = Date.now() - updateStart;

      test(
        "Update application status",
        updateRes.ok,
        `Status: ${updateRes.status}`,
        updateDuration,
      );
    }
  } catch (error: any) {
    test("Application workflow", false, error.message);
  }

  // FLOW 5: DevConnect Linking
  console.log("\n�� FLOW 5: DevConnect Account Linking");
  console.log("=".repeat(50));

  try {
    // Link DevConnect account
    const linkStart = Date.now();
    const linkRes = await fetch(`${BASE_URL}/api/devconnect/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: testUsers.creator1.id,
        devconnect_username: "devconnect_user_1",
        devconnect_profile_url: "https://dev-link.me/devconnect_user_1",
      }),
    });
    const linkData = await linkRes.json();
    const linkDuration = Date.now() - linkStart;

    test(
      "Link DevConnect account",
      linkRes.status === 201 || linkRes.status === 200,
      `Status: ${linkRes.status}`,
      linkDuration,
    );

    // Get DevConnect link
    const getLinkStart = Date.now();
    const getLinkRes = await fetch(
      `${BASE_URL}/api/devconnect/link?user_id=${testUsers.creator1.id}`,
    );
    const getLinkData = await getLinkRes.json();
    const getLinkDuration = Date.now() - getLinkStart;

    test(
      "Get DevConnect link",
      getLinkRes.ok && getLinkData.data,
      `Status: ${getLinkRes.status}`,
      getLinkDuration,
    );

    if (getLinkRes.ok && getLinkData.data) {
      assertEquals(
        getLinkData.data.devconnect_username,
        "devconnect_user_1",
        "Username mismatch",
      );
    }

    // Unlink DevConnect account
    const unlinkRes = await fetch(`${BASE_URL}/api/devconnect/link`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: testUsers.creator1.id }),
    });

    test(
      "Unlink DevConnect account",
      unlinkRes.ok,
      `Status: ${unlinkRes.status}`,
      0,
    );
  } catch (error: any) {
    test("DevConnect linking", false, error.message);
  }

  // FLOW 6: Filtering and Search
  console.log("\n🔍 FLOW 6: Advanced Filtering & Search");
  console.log("=".repeat(50));

  try {
    // Test creator search
    const searchStart = Date.now();
    const searchRes = await fetch(
      `${BASE_URL}/api/creators?search=${testUsers.creator1.username.substring(0, 5)}`,
    );
    const searchData = await searchRes.json();
    const searchDuration = Date.now() - searchStart;

    test(
      "Search creators by name",
      searchRes.ok && Array.isArray(searchData.data),
      `Status: ${searchRes.status}, Found: ${searchData.data?.length || 0}`,
      searchDuration,
    );

    // Test opportunity filtering by experience level
    const expFilterStart = Date.now();
    const expRes = await fetch(
      `${BASE_URL}/api/opportunities?experienceLevel=senior`,
    );
    const expData = await expRes.json();
    const expFilterDuration = Date.now() - expFilterStart;

    test(
      "Filter opportunities by experience level",
      expRes.ok && Array.isArray(expData.data),
      `Status: ${expRes.status}, Found: ${expData.data?.length || 0}`,
      expFilterDuration,
    );

    // Test pagination
    const page1Start = Date.now();
    const page1Res = await fetch(`${BASE_URL}/api/creators?page=1&limit=5`);
    const page1Data = await page1Res.json();
    const page1Duration = Date.now() - page1Start;

    test(
      "Pagination - page 1",
      page1Res.ok && page1Data.pagination?.page === 1,
      `Page: ${page1Data.pagination?.page}, Limit: ${page1Data.pagination?.limit}`,
      page1Duration,
    );

    assertExists(
      page1Data.pagination?.pages,
      "Total pages should be calculated",
    );
  } catch (error: any) {
    test("Filtering and search", false, error.message);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => r.passed === false).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n📊 Test Summary:`);
  console.log(`   ✓ Passed: ${passed}`);
  console.log(`   ✗ Failed: ${failed}`);
  console.log(`   Total: ${results.length}`);
  console.log(
    `   Duration: ${totalDuration}ms (avg ${(totalDuration / results.length).toFixed(0)}ms per test)`,
  );
  console.log("\n" + "=".repeat(50));

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.name}: ${r.message}`);
      });
  } else {
    console.log("\n✅ All tests passed!");
  }

  return { passed, failed, total: results.length, totalDuration };
}

// Run tests
runE2ETests()
  .then((summary) => {
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
