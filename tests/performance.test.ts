/**
 * Performance Test Suite
 * Phase 3: Testing & Validation
 *
 * Measures response times, throughput, and identifies bottlenecks
 */

interface PerformanceMetric {
  endpoint: string;
  method: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  p95Time: number;
  p99Time: number;
  requestsPerSecond: number;
}

const BASE_URL = "http://localhost:5173";
const metrics: PerformanceMetric[] = [];

// Helper to measure request time
async function measureRequest(
  method: string,
  endpoint: string,
  body?: any,
): Promise<number> {
  const start = performance.now();
  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);

    await fetch(`${BASE_URL}${endpoint}`, options);
    return performance.now() - start;
  } catch {
    return performance.now() - start;
  }
}

// Run multiple requests and collect metrics
async function benchmarkEndpoint(
  method: string,
  endpoint: string,
  numRequests: number = 50,
  body?: any,
): Promise<PerformanceMetric> {
  console.log(
    `  Benchmarking ${method.padEnd(6)} ${endpoint.padEnd(35)} (${numRequests} requests)...`,
  );

  const times: number[] = [];
  const startTime = Date.now();

  for (let i = 0; i < numRequests; i++) {
    const time = await measureRequest(method, endpoint, body);
    times.push(time);
  }

  const elapsed = Date.now() - startTime;
  times.sort((a, b) => a - b);

  const metric: PerformanceMetric = {
    endpoint,
    method,
    avgTime: times.reduce((a, b) => a + b) / times.length,
    minTime: times[0],
    maxTime: times[times.length - 1],
    p95Time: times[Math.floor(times.length * 0.95)],
    p99Time: times[Math.floor(times.length * 0.99)],
    requestsPerSecond: (numRequests / elapsed) * 1000,
  };

  metrics.push(metric);
  return metric;
}

async function runPerformanceTests() {
  console.log("⚡ Performance Test Suite\n");

  // CATEGORY 1: GET Endpoints (Read-Heavy)
  console.log("\n📊 Category 1: GET Endpoints (Read Performance)");
  console.log("=".repeat(70));

  console.log("\nBrowse endpoints (pagination-heavy):");
  await benchmarkEndpoint("GET", "/api/creators?page=1&limit=20", 50);
  await benchmarkEndpoint("GET", "/api/opportunities?page=1&limit=20", 50);
  await benchmarkEndpoint("GET", "/api/applications?user_id=test-user", 40);

  console.log("\nFilter endpoints (filtered queries):");
  await benchmarkEndpoint("GET", "/api/creators?arm=gameforge", 50);
  await benchmarkEndpoint(
    "GET",
    "/api/opportunities?arm=gameforge&sort=recent",
    50,
  );
  await benchmarkEndpoint("GET", "/api/creators?search=test", 40);

  console.log("\nIndividual resource retrieval:");
  await benchmarkEndpoint("GET", "/api/creators/test_user", 50);
  await benchmarkEndpoint("GET", "/api/opportunities/test-opp-id", 40);
  await benchmarkEndpoint("GET", "/api/devconnect/link?user_id=test-user", 40);

  // CATEGORY 2: POST Endpoints (Write Performance)
  console.log("\n📊 Category 2: POST Endpoints (Write Performance)");
  console.log("=".repeat(70));

  const createCreatorBody = {
    user_id: `perf-test-${Date.now()}`,
    username: `perf_user_${Math.random().toString(36).substring(7)}`,
    bio: "Performance test creator",
    experience_level: "junior",
  };

  console.log("\nCreate operations:");
  await benchmarkEndpoint("POST", "/api/creators", 30, {
    ...createCreatorBody,
    user_id: `perf-${Date.now()}-1`,
    username: `perf_user_${Date.now()}_1`,
  });

  const createOppBody = {
    user_id: `perf-creator-${Date.now()}`,
    title: "Performance Test Job",
    description: "Testing performance",
    job_type: "contract",
  };

  await benchmarkEndpoint("POST", "/api/opportunities", 25, createOppBody);
  await benchmarkEndpoint("POST", "/api/applications", 20, {
    user_id: `perf-app-creator-${Date.now()}`,
    opportunity_id: "test-opp-id",
    cover_letter: "Performance test application",
  });

  // CATEGORY 3: PUT Endpoints (Update Performance)
  console.log("\n📊 Category 3: PUT Endpoints (Update Performance)");
  console.log("=".repeat(70));

  console.log("\nUpdate operations:");
  await benchmarkEndpoint("PUT", "/api/creators/test-id", 25, {
    bio: "Updated bio",
    skills: ["javascript", "typescript"],
  });

  await benchmarkEndpoint("PUT", "/api/opportunities/test-opp-id", 20, {
    user_id: "test-user",
    title: "Updated Title",
    status: "closed",
  });

  // CATEGORY 4: Complex Queries
  console.log("\n📊 Category 4: Complex & Heavy Queries");
  console.log("=".repeat(70));

  console.log("\nPaginated + Filtered queries:");
  await benchmarkEndpoint(
    "GET",
    "/api/creators?arm=gameforge&search=test&page=1&limit=50",
    30,
  );
  await benchmarkEndpoint(
    "GET",
    "/api/opportunities?arm=labs&experienceLevel=senior&jobType=full-time&page=1&limit=50",
    25,
  );

  console.log("\nMulti-page traversal:");
  await benchmarkEndpoint("GET", "/api/creators?page=2&limit=20", 30);
  await benchmarkEndpoint("GET", "/api/creators?page=5&limit=20", 30);
  await benchmarkEndpoint("GET", "/api/opportunities?page=3&limit=20", 25);

  // Generate Report
  console.log("\n" + "=".repeat(70));
  console.log("\n📈 Performance Report\n");

  // Group by endpoint
  const grouped = new Map<string, PerformanceMetric[]>();
  metrics.forEach((m) => {
    const key = `${m.method} ${m.endpoint.split("?")[0]}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(m);
  });

  // Print detailed metrics
  grouped.forEach((metricList, endpoint) => {
    const avg =
      metricList.reduce((sum, m) => sum + m.avgTime, 0) / metricList.length;
    const p95 =
      metricList.reduce((sum, m) => sum + m.p95Time, 0) / metricList.length;
    const p99 =
      metricList.reduce((sum, m) => sum + m.p99Time, 0) / metricList.length;
    const rps =
      metricList.reduce((sum, m) => sum + m.requestsPerSecond, 0) /
      metricList.length;

    console.log(`📍 ${endpoint}`);
    console.log(`   Avg:  ${avg.toFixed(2)}ms`);
    console.log(`   P95:  ${p95.toFixed(2)}ms`);
    console.log(`   P99:  ${p99.toFixed(2)}ms`);
    console.log(`   RPS:  ${rps.toFixed(2)}`);
    console.log("");
  });

  // Performance targets
  console.log("🎯 Performance Targets & Compliance\n");

  const targets = {
    "GET endpoints": { target: 100, actual: 0, threshold: "< 100ms" },
    "POST endpoints": { target: 200, actual: 0, threshold: "< 200ms" },
    "PUT endpoints": { target: 150, actual: 0, threshold: "< 150ms" },
    "Complex queries": { target: 250, actual: 0, threshold: "< 250ms" },
  };

  let targetsPassed = 0;
  let targetsFailed = 0;

  metrics.forEach((m) => {
    if (m.method === "GET") {
      targets["GET endpoints"].actual = Math.max(
        targets["GET endpoints"].actual,
        m.avgTime,
      );
    } else if (m.method === "POST") {
      targets["POST endpoints"].actual = Math.max(
        targets["POST endpoints"].actual,
        m.avgTime,
      );
    } else if (m.method === "PUT") {
      targets["PUT endpoints"].actual = Math.max(
        targets["PUT endpoints"].actual,
        m.avgTime,
      );
    }
  });

  // Check complex queries
  const complexQueries = metrics.filter(
    (m) => m.endpoint.includes("?") && m.endpoint.split("&").length > 2,
  );
  if (complexQueries.length > 0) {
    targets["Complex queries"].actual = Math.max(
      ...complexQueries.map((m) => m.avgTime),
    );
  }

  Object.entries(targets).forEach(([category, data]) => {
    if (data.actual === 0) return; // Skip if no data

    const passed = data.actual <= data.target;
    const symbol = passed ? "✓" : "✗";
    console.log(
      `${symbol} ${category.padEnd(20)} ${data.actual.toFixed(2)}ms ${data.threshold}`,
    );

    if (passed) targetsPassed++;
    else targetsFailed++;
  });

  // Summary Statistics
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 Summary Statistics\n");

  const allTimes = metrics.map((m) => m.avgTime);
  const slowestEndpoint = metrics.reduce((a, b) =>
    a.avgTime > b.avgTime ? a : b,
  );
  const fastestEndpoint = metrics.reduce((a, b) =>
    a.avgTime < b.avgTime ? a : b,
  );

  console.log(`Total Endpoints Tested: ${metrics.length}`);
  console.log(
    `Average Response Time: ${(allTimes.reduce((a, b) => a + b) / allTimes.length).toFixed(2)}ms`,
  );
  console.log(
    `Fastest: ${fastestEndpoint.method} ${fastestEndpoint.endpoint.split("?")[0]} (${fastestEndpoint.avgTime.toFixed(2)}ms)`,
  );
  console.log(
    `Slowest: ${slowestEndpoint.method} ${slowestEndpoint.endpoint.split("?")[0]} (${slowestEndpoint.avgTime.toFixed(2)}ms)`,
  );
  console.log(
    `\nPerformance Targets: ${targetsPassed} passed, ${targetsFailed} failed`,
  );

  if (targetsFailed === 0) {
    console.log("\n✅ All performance targets met!");
  } else {
    console.log(
      `\n⚠️ ${targetsFailed} performance targets not met. Optimization needed.`,
    );
  }

  console.log("\n" + "=".repeat(70));
  return { passed: targetsPassed, failed: targetsFailed };
}

runPerformanceTests()
  .then((summary) => {
    process.exit(summary.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("Performance test failed:", error);
    process.exit(1);
  });
