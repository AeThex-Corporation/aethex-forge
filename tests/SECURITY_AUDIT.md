# Creator Network Security Audit Checklist

## Phase 3: Testing & Validation

### 🔐 Authentication & Authorization

- [ ] **JWT Validation**

  - [ ] All protected endpoints require valid JWT token
  - [ ] Expired tokens are rejected
  - [ ] Invalid/malformed tokens return 401
  - [ ] Token claims are validated before processing

- [ ] **User Context Extraction**

  - [ ] user_id is extracted from Supabase auth context (not request body)
  - [ ] User cannot access/modify other users' data
  - [ ] Session invalidation works properly on logout

- [ ] **Authorization Checks**
  - [ ] Creator can only update their own profile
  - [ ] Opportunity creator can only update their own opportunities
  - [ ] Applicant can only withdraw their own applications
  - [ ] Only opportunity creator can review applications
  - [ ] DevConnect links are user-specific

### 🛡️ Row Level Security (RLS) Policies

- [ ] **aethex_creators table**

  - [ ] Users can read own profile
  - [ ] Users can update own profile
  - [ ] Public profiles are discoverable (is_discoverable=true)
  - [ ] Private profiles (is_discoverable=false) are hidden from directory

- [ ] **aethex_opportunities table**

  - [ ] Anyone can read open opportunities
  - [ ] Only creator can update/delete own opportunities
  - [ ] Closed opportunities not visible to applicants

- [ ] **aethex_applications table**

  - [ ] Users can read their own applications
  - [ ] Applicant can only see their own applications
  - [ ] Opportunity creator can see applications for their opportunities
  - [ ] Users cannot access others' applications

- [ ] **aethex_devconnect_links table**

  - [ ] Users can only access their own DevConnect links
  - [ ] Links cannot be modified by non-owners

- [ ] **aethex_projects table**
  - [ ] Users can read public projects
  - [ ] Users can only modify their own projects

### 🔒 Data Protection

- [ ] **Sensitive Data**

  - [ ] Passwords are never returned in API responses
  - [ ] Email addresses are not exposed in public profiles
  - [ ] Private notes/applications are not leaked

- [ ] **Cover Letters**

  - [ ] Only applicant and opportunity creator can see cover letters
  - [ ] Cover letters are not visible in search results

- [ ] **Rate Limiting**
  - [ ] Rate limiting is implemented on POST endpoints
  - [ ] Prevents spam applications/profiles
  - [ ] Prevents brute force attacks on search

### 🚫 Input Validation & Sanitization

- [ ] **Text Fields**

  - [ ] Bio/description max length enforced (e.g., 500 chars)
  - [ ] Username format validated (alphanumeric, dashes, underscores)
  - [ ] HTML/script tags are escaped in output

- [ ] **File Uploads**

  - [ ] Avatar URLs are validated/whitelisted
  - [ ] No malicious file types accepted
  - [ ] File size limits enforced

- [ ] **Array Fields**

  - [ ] Skills array has max length
  - [ ] Arm affiliations are from valid set
  - [ ] Invalid values are rejected

- [ ] **Numeric Fields**
  - [ ] Salary values are reasonable ranges
  - [ ] Page/limit parameters are validated
  - [ ] Negative values rejected where inappropriate

### 🔗 API Endpoint Security

**Creators Endpoints:**

- [ ] GET /api/creators

  - [ ] Pagination parameters validated
  - [ ] Search doesn't expose private fields
  - [ ] Arm filter works correctly

- [ ] GET /api/creators/:username

  - [ ] Returns 404 if profile is not discoverable
  - [ ] No sensitive data leaked

- [ ] POST /api/creators

  - [ ] Requires auth
  - [ ] user_id extracted from auth context
  - [ ] Duplicate username prevention works

- [ ] PUT /api/creators/:id
  - [ ] Requires auth
  - [ ] User can only update own profile
  - [ ] No privilege escalation possible

**Opportunities Endpoints:**

- [ ] GET /api/opportunities

  - [ ] Only open opportunities shown
  - [ ] Closed/draft opportunities hidden
  - [ ] Pagination and filters work

- [ ] GET /api/opportunities/:id

  - [ ] Only returns open opportunities
  - [ ] Creator info is sanitized

- [ ] POST /api/opportunities

  - [ ] Requires auth + creator profile
  - [ ] user_id extracted from auth
  - [ ] Only opportunity creator can post

- [ ] PUT /api/opportunities/:id
  - [ ] Requires auth
  - [ ] Only creator can update own opportunity
  - [ ] Can't change posted_by_id

**Applications Endpoints:**

- [ ] GET /api/applications

  - [ ] Requires user_id + auth
  - [ ] Users only see their own applications
  - [ ] Opportunity creators can view applications

- [ ] POST /api/applications

  - [ ] Requires auth + creator profile
  - [ ] Validates opportunity exists
  - [ ] Prevents duplicate applications
  - [ ] Validates cover letter length

- [ ] PUT /api/applications/:id

  - [ ] Requires auth
  - [ ] Only opportunity creator can update
  - [ ] Can only change status/response_message
  - [ ] Can't change creator/opportunity

- [ ] DELETE /api/applications/:id
  - [ ] Requires auth
  - [ ] Only applicant can withdraw
  - [ ] Application is properly deleted

**DevConnect Endpoints:**

- [ ] POST /api/devconnect/link

  - [ ] Requires auth + creator profile
  - [ ] user_id from auth context
  - [ ] Validates DevConnect username format

- [ ] GET /api/devconnect/link

  - [ ] Requires user_id + auth
  - [ ] Users only see their own link
  - [ ] Returns null if not linked

- [ ] DELETE /api/devconnect/link
  - [ ] Requires auth
  - [ ] Only user can unlink their account
  - [ ] Updates devconnect_linked flag

### 🔍 SQL Injection Prevention

- [ ] **Parameterized Queries**

  - [ ] All Supabase queries use parameterized queries (not string concatenation)
  - [ ] User input never directly in SQL strings
  - [ ] Search queries are sanitized

- [ ] **Search/Filter Safety**
  - [ ] LIKE queries use proper escaping
  - [ ] OR conditions properly scoped
  - [ ] No SQL concatenation

### 🌐 CORS & External Access

- [ ] **CORS Headers**

  - [ ] Only allowed origins can call API
  - [ ] Credentials are properly scoped
  - [ ] Preflight requests handled correctly

- [ ] **External Links**
  - [ ] DevConnect URLs validated
  - [ ] Avatar URLs validated
  - [ ] No javascript: or data: URLs allowed

### 📋 Audit Logging

- [ ] **Critical Actions Logged**

  - [ ] User account creation
  - [ ] Opportunity creation/deletion
  - [ ] Application status changes
  - [ ] DevConnect linking/unlinking
  - [ ] Profile modifications

- [ ] **Log Retention**
  - [ ] Logs stored securely
  - [ ] Logs retained for compliance period
  - [ ] Sensitive data not logged

### 🔄 API Response Security

- [ ] **Error Messages**

  - [ ] Don't leak system details
  - [ ] Don't expose database structure
  - [ ] Generic error messages for auth failures
  - [ ] No stack traces in production

- [ ] **Response Headers**
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY
  - [ ] Content-Security-Policy set
  - [ ] X-XSS-Protection enabled

### 📱 Frontend Security

- [ ] **Token Management**

  - [ ] Tokens stored securely (not localStorage if possible)
  - [ ] Tokens cleared on logout
  - [ ] Token refresh handled properly

- [ ] **XSS Prevention**

  - [ ] User input escaped in templates
  - [ ] No dangerouslySetInnerHTML without sanitization
  - [ ] No eval() or similar dangerous functions

- [ ] **CSRF Protection**
  - [ ] State-changing requests use POST/PUT/DELETE
  - [ ] CSRF tokens included where applicable

### ✅ Testing Recommendations

1. **Penetration Testing**

   - Test SQL injection attempts
   - Test XSS payloads in input fields
   - Test CSRF attacks
   - Test broken access control

2. **Authorization Testing**

   - Try accessing other users' resources
   - Test privilege escalation attempts
   - Verify RLS policies are enforced

3. **Data Validation Testing**

   - Send oversized inputs
   - Send malformed data
   - Test boundary values
   - Send special characters

4. **Rate Limit Testing**
   - Rapid-fire requests
   - Concurrent requests
   - Verify limits are enforced

### 📝 Sign-Off

- [ ] All critical findings resolved
- [ ] All high-priority findings mitigated
- [ ] Security baseline established
- [ ] Monitoring and logging active
- [ ] Team trained on security practices

---

**Audit Date:** ********\_********
**Auditor:** ********\_********
**Status:** PENDING ⏳
