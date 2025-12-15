# Product Requirements Document (PRD)

## Product Name: Franchise Match Platform

**Company:** Franchise Grade

**Target Users:** Franchise Candidates, Advisors, Super Admins

---

## 1. Executive Summary

Franchise Grade is developing an intelligent, investor-first franchise discovery and advisory platform. This solution addresses the fragmented, brand-biased nature of the current franchise search process by delivering a structured, personalized, and unbiased experience that helps users discover, evaluate, and confidently commit to the right franchise opportunity.

---

## 2. Problem Statement

Currently, franchise investors face:

- **Fragmented Information**: No centralized, neutral place to compare and understand franchises.
- **Brand- or Commission-Biased Platforms**: Most tools favor paying brands or brokers.
- **No True Personalization**: Lack of intelligent matching based on the investor’s profile.
- **Confusion & Misalignment**: High risk of poor investment decisions due to limited context.

> The issue is not lack of franchise options — it’s the absence of a reliable system to guide investors from curiosity to confident ownership.
> 

---

## 3. Vision & Strategic Goals

Create an intelligent franchise discovery platform that:

- **Empowers informed decisions**: Help users identify and evaluate franchise opportunities aligned with their budget, location, lifestyle, and skill set.
- **Delivers user-centric personalization**: Use AI and behavioral data to match users with franchises based on profile and readiness.
- **Ensures neutrality and transparency**: Recommend franchises based on fit, not commercial incentives.
- **Facilitates advisor collaboration**: Seamlessly integrate certified advisors into the user journey for expert validation and support.
- **Supports scalable growth**: Design a platform foundation that accommodates future features like mobile apps, multilingual support, and premium tools.

---

## 4. Core Features

### 1. Smart Onboarding & Match Engine

**Goal**: Capture essential candidate data and generate personalized franchise matches.

### UX Components:

- Interactive step-by-step onboarding wizard (≤ 5 steps)
- Inputs: Investment range, preferred location, lifestyle/workload expectations, industry interests, and skills/confidence levels
- CTA: "Find my best matches"
- Output: Personalized match list with Match Grades (A–D), explanation tags (Why This / Why Not), and actions to explore further

---

### 2. Franchise Discovery & Comparison Hub

**Goal**: Enable users to explore, save, and compare franchises in a structured format.

### UX Components:

- Grid/list of franchise cards: Shows key data like investment, involvement, availability, and match grade
- Filters: Budget, Industry, Involvement, Tags
- Franchise Detail Page includes:
    - Overview: Match grade, summary highlights
    - Key info: Investment range, ideal candidate, available territories, performance insights
    - Tools: Save, Compare, Start Ownership Path, Talk to Advisor

---

### 3. Guided Decision Journey (Ownership Path)

**Goal**: Convert interest into action through structured steps and support.

### UX Components:

- Visual progress checklist: Steps like "Territory confirmed," "Discovery call completed," etc.
- Contextual insights and check-ins to reduce drop-off
- Embedded advisor collaboration and educational nudges
- CTAs: Schedule call, download FDD guide, move to next stage

---

## 5. User Roles

### Candidate (`role: user`)

- Completes onboarding and receives match results
- Explores and compares franchise options
- Can start guided Ownership Paths after approval

### Advisor (`role: admin`)

- Views user activity and engagement
- Flags fit or risk based on territory or background
- Manages Ownership Path steps and adds insight notes

### Super Admin (`role: master`)

- Manages full platform data: brands, advisors, content blocks
- Controls tagging systems, territories, and filters
- Views analytics dashboards and lead funnel behavior

---

## 6. Technical Architecture Overview (MVP)

- Tech Stack: React + Tailwind + Shadcn UI
- Authentication: Email (OTP Magic Link) + OAuth (Google/Apple)
- Database: PostgreSQL + JSONB fields for dynamic blocks
- Multi-tenant structure with RLS enforcement by `company_id`
- Designed for dynamic matching, progressive onboarding, and secure advisor access

---

## 7. Data Models (Simplified)

### Users

- user_id (UUID), role (enum: master, advisor, candidate)

### Candidate Profile

- investment_range, preferred_industries, hours_per_week, location (geo + postal), skills (JSONB)

### Franchise (Brand)

- name, sector, category, investment range, tags, visibility settings

### Match Results

- grade (A–D), reasons (JSONB), fit factors: budget, territory, lifestyle, background

### Ownership Path

- path_id, user_id, brand_id, steps completed, advisor notes

---

## 8. Pages Overview

### Public Pages

- **Home**: Conversion-focused overview and CTAs
- **Browse**: Preview franchises with limited interaction
- **Advisor Directory**: Meet advisors and their specialties
- **Industry / Region Directory**: Deep link entry points
- **Academy**: Structured learning content (text + video)

### Authenticated Pages

- **Dashboard**: Search, filter, and access matches
- **Brand Detail Page**: Deep dive into selected franchises
- **Compare View**: Table-based side-by-side comparison
- **Ownership Path**: Visual progress tracker
- **Profile**: User inputs + option to rerun match engine

### Admin & Advisor

- **Candidate CRM**: Track users by funnel stage
- **Franchise Editor**: Add/edit brand content
- **Alerts System**: Territory conflict, readiness score, etc.

---

## 9. Visual Design System

- Font: Manrope (400–700)
- Colors:
    - Primary: Navy #203D57
    - Accent: Green #54B936
    - Cobalt Series: #446786 to #F4F8FE
- Components: Rounded inputs, button hover states, material icons
- Layout: 12-column grid, no shadows, clear spacing
- Reference: [https://mvp.franchisegrade.com](https://mvp.franchisegrade.com/)

---

## 10. Integrations

- Supabase (Auth, DB)
- HubSpot (Lead tracking & marketing)
- Stripe (Future payment support)
- ChatGPT API (AI matching & content generation)

---

## 11. Future Enhancements

- Localization (US, Canada, ES)
- In-app messaging between candidate and advisor
- AI-enhanced onboarding quiz
- Personal finance planning tool
- Native mobile app (React Native)

---

## 12. Success Metrics

- Onboarding completion rate
- Match engagement (clicks, saves, advisor calls)
- Brand conversion funnel: views → compares → contact → Ownership Path
- Decision velocity (time to commitment)
- Advisor satisfaction (lead quality, communication tools)

---

## 13. Timeline

**MVP Goals (First 90 Days):**

- Core onboarding and matching
- Franchise detail and match score logic
- Dashboard and comparison tools
- Advisor collaboration UI
- Admin content control and analytics

---

## Appendix

- Glossary: FI Platform, FDD, Ownership Path, Match Grade【42†source】
- Frameworks: Buyer Journey (Engage → Educate → Evaluate → Justify → Purchase)【42†source】
- Personas: Executive Transition, Hometown Hero, Brand Fan, Serial Entrepreneur【42†source】

---

**Document Owner:** Franchise Grade Product Team

**Last Updated:** Dec 2025

---
