# Features and Roadmap

## Features

### 1. Authentication & User Management

-  **Multi-provider Login**: Support for Google, GitHub, and standard Email/Password authentication.
-  **Secure Access**: Powered by NextAuth.js (Auth.js) v5.
-  **User Profiles**: Manage profile information and account settings.

### 2. Brand Identity Management

-  **Brand Creation**: Tools to define brand name, tagline, description, and industry.
-  **Visual Identity**: Selector for primary, secondary, and accent colors.
-  **Typography**: Configuration for primary and secondary fonts.

### 3. AI Logo Generation

-  **Text-to-Logo**: Generate unique logos based on brand description and prompts.
-  **AI Models**: Integrated with Hugging Face Inference API for image generation.
-  **Customization**: Fine-tune prompts to guide the AI's output.

### 4. Advanced Image Processing

-  **Vectorization**: Convert raster (PNG/JPG) generated logos into scalable SVG format using `@neplex/vectorizer`.
-  **Background Removal**: Automatically remove backgrounds for transparent logo usage.

### 5. Payments & Subscriptions

-  **Credit System**: 'Pay-as-you-go' model for generating logos.
-  **Subscription Plans**: Monthly and Yearly plans for continuous access.
-  **Payment Gateway**: Integrated with Midtrans for secure payments (Bank Transfer, QRIS, etc.).

### 6. Admin Dashboard

-  **User Management**: View and ban/unban users.
-  **Transaction Monitoring**: Track sales and credits.
-  **System Settings**: Configure global application settings.

---

## Roadmap

> [!NOTE]
> This roadmap outlines the planned development phases for BrandAI.

### Phase 1: MVP Polish (Current Status)

-  [x] Core Authentication & Authorization.
-  [x] Basic Brand & Logo Management.
-  [x] Integration with Midtrans Payment Gateway.
-  [ ] **Priority**: UI/UX consistency improvements (e.g., loading states, error handling).
-  [ ] **Priority**: Mobile responsiveness optimization.

### Phase 2: Enhanced AI Capabilities

-  [ ] **Multiple Models**: Integration with DALL-E 3 or Stable Diffusion XL for higher quality generations.
-  [ ] **Prompt Assistant**: AI helper to refine user prompts for better results.
-  [ ] **Canvas Editor**: Integrated editor using **Konva.js** for adding text, resizing, and layering brands on logos.
-  [ ] **In-painting**: Allow users to edit specific parts of a generated logo.

### Phase 3: Team & Collaboration

-  [ ] **Team Accounts**: Invite members to manage brand assets.
-  [ ] **Shared Workspaces**: Collaborative editing of brand guidelines.
-  [ ] **Role-based Access Control (RBAC)**: Fine-grained permissions for team members.

### Phase 4: Expansion & Mobile

-  [ ] **Mobile App**: Dedicated React Native application for iOS and Android.
-  [ ] **API Access**: Public API for developers to generate logos programmatically.
-  [ ] **Global Payments**: Stripe integration for international customers.
