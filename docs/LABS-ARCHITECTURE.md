# LABS Architecture: The For-Profit R&D Engine

## Strategic Clarification

The `LABS` (Yellow) Arm is **100% For-Profit** and remains part of `aethex.dev`. This clarifies the earlier confusion about whether Labs should be non-profit or for-profit.

### The Complete Ecosystem Picture

#### `aethex.foundation` (The "Guardian")
- **Type:** Non-Profit
- **Primary Role:** Identity issuance and open-source research
- **Key Function:** Guardian of the open-source **Axiom Protocol**
- **Serves As:** The public-good "university" (`nexus.aethex.dev`'s `/hub/protocol` pages)
- **Focus:** Community education, mentorship, and open-source development

#### `aethex.dev` (The "Engine")
- **Type:** For-Profit
- **Primary Role:** Commercial application platform
- **Research & Development:** The **LABS** (Yellow) Arm
- **Job:** Takes the open-source Axiom Protocol and builds proprietary, closed-source "secret weapons" on top
- **First Project:** AI-driven Procedural Content Generation (PCG) engine

### Research vs. Development

| Aspect | Foundation | LABS |
|--------|-----------|------|
| **Entity Type** | Non-Profit | For-Profit |
| **Focus** | Open-Source Research | Proprietary Development |
| **Role** | Guardian of Axiom Protocol | Internal R&D Department |
| **Output** | Community Knowledge | Competitive Advantage |
| **Access** | Public | A-Corp Employees / Verified Users |

## LABS Dashboard Architecture

**URL:** `/dashboard/labs`

**Theme:** Technical, minimalist, "Blueprint" (Yellow/Amber accents, Monospace fonts)

**JTBD:** "As an A-Corp engineer or Founder, I need to track our R&D projects, manage our IP pipeline, and see the whitepapers we're publishing."

**Access Control:** Soft-gated (public users see "Join Labs?" CTA; A-Corp employees see full dashboard)

### Widget 1: Active Research Tracks (Project Tracking)

**Purpose:** High-level Kanban or list of all internal, proprietary R&D projects.

**Sample Data:**
- **"Axiom PCG Engine (for dev-link.me)"** [Status: In Development]
- **".aethex TLD Smart Contracts"** [Status: In Research]
- **"QuantumLeap Predictive Model v2"** [Status: Scoping]

**Functionality:**
- Display project status (Scoping → Research → In Development → Testing → Released)
- Show progress indicators
- Link to project details and whitepapers
- Display project lead and team

### Widget 2: IP & Patent Dashboard (IP Management)

**Purpose:** The "output" of LABS. This is the "transfer pricing" model from the business model document (Part 8).

**Display Table:**
| IP Name | Status | Licensed To |
|---------|--------|------------|
| Axiom PCG Engine | [Filed] | The AeThex Corp |
| aethex.me IP | [Secured] | The AeThex Corp |

**Functionality:**
- Track all proprietary IP (Patents, Trademarks, Trade Secrets)
- Show filing status and dates
- Indicate which subsidiaries/entities are licensed
- Admin-only access with sensitive information

### Widget 3: Publication Pipeline (Thought Leadership)

**Purpose:** Dashboard for the Marketing Team (SOP-402) to track R&D content and thought leadership.

**Sample Data:**
- "The Tech Behind PCG" [Status: Drafting]
- "Why We Chose a .aethex TLD" [Status: Published on aethex.blog]

**Functionality:**
- List upcoming technical whitepapers and blog posts
- Show publication status (Drafting → Review → Published)
- Link to published content on aethex.blog
- Display author and expected publication date
- Soft-gated: public can see published content; A-Corp can see drafts

### Widget 4: My Labs Bounties (The "Bridge" to NEXUS)

**Purpose:** A filtered view of the NEXUS bounty board showing only high-difficulty, high-reward "Research Bounties" that LABS has posted for elite "Architect" community members to help with.

**Functionality:**
- Filter NEXUS bounties by "research" category
- Show only high-reward opportunities
- Display difficulty level and required expertise
- Link to full NEXUS bounty page
- Show number of active applicants and top candidates

## CTAs (Calls to Action)

- `[ Submit a New Research Proposal ]` - Form to propose new R&D projects
- `[ Browse LABS Bounties ]` - Links to filtered NEXUS bounty board for research opportunities

## Access Control & Soft-Gating

### Public Users (Not A-Corp Employees)
- See header: "Research LABS"
- See "Join Labs?" CTA
- Can view published whitepapers (Publication Pipeline - published only)
- Cannot access research tracks, IP dashboard, or draft content
- Navigation: CTA button links to `/labs/join-request` or similar

### A-Corp Employees / Verified Users
- Full access to all widgets
- Can see all research tracks and progress
- Can view IP dashboard (with appropriate role restrictions)
- Can see publication pipeline (drafts + published)
- Can browse and apply to LABS bounties
- Can submit research proposals

## Technical Implementation Notes

1. **Database Tables Needed:**
   - `labs_research_tracks` (projects, status, progress, lead_id)
   - `labs_ip_portfolio` (ip_name, type, status, filing_date, licensed_to)
   - `labs_publications` (title, description, status, published_date, content_url)
   - `labs_bounties` (links to nexus opportunities, filtered by category)

2. **API Endpoints:**
   - `GET /api/labs/research-tracks` - Fetch all research tracks
   - `GET /api/labs/ip-portfolio` - Fetch IP portfolio (admin + A-Corp)
   - `GET /api/labs/publications` - Fetch publications (public + A-Corp)
   - `GET /api/labs/bounties` - Fetch research bounties from NEXUS
   - `POST /api/labs/submit-proposal` - Submit research proposal
   - `POST /api/labs/join-request` - Request to join LABS (soft-gating)

3. **Soft-Gating Logic:**
   - Check user's `arm_affiliations` table for "labs" affiliation
   - Check if user has A-Corp role or is verified member
   - Return different UI based on access level

4. **Theme & Styling:**
   - Primary color: Amber/Yellow (#f59e0b, #fbbf24)
   - Font: Monospace (e.g., "Monaco", "Courier New", "IBM Plex Mono")
   - Background: Dark with technical grid patterns
   - Accent: Amber/yellow highlights for technical elements

## Priority & Timeline

This dashboard is greenlit to build **after NEXUS and CORP** per the priority list.

## References

- Original Business Model: Part 8 (Transfer Pricing Model)
- Axiom Protocol Documentation: `/hub/protocol` pages
- NEXUS Architecture: `NEXUS-ARCHITECTURE.md`
