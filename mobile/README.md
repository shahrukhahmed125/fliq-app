# Fliq — Native React Native Mobile App (Expo)

This directory contains the genuine **React Native** mobile application for **Fliq** built with **Expo**, **Expo Router**, and **TypeScript**.

It is completely separate from the React web frontend, using standard native components (`View`, `Text`, `Pressable`, `TextInput`, `Image`, `ScrollView`, `FlatList`, `StyleSheet`) and mobile-first patterns.

---

## 📱 Features Implemented

1. **Native Tab Navigation (`Expo Router`)**:
   - **Home Feed**: Pull-to-refresh feed, segmented "For You" & "Trending" tabs, and live post interactions.
   - **Explore / Search**: Pakistan live trends (`#Cricket`, `#TechTrends`, `#DesignPK`), category filters, and featured Pakistani creator discovery cards.
   - **Post Composer**: Native thought creator with `expo-image-picker` multi-image selection, topic chips, city selector, and upload simulation.
   - **Alerts / Notifications**: Likes, replies, reposts, and new follower activity feed.
   - **Profile**: Cover banner with Pakistan aesthetic, avatar initials, verified badge, followers/following counts, and post history.

2. **Media Collage Engine**:
   - 1-image hero display.
   - 2-image dual columns.
   - 3-image layout (1 prominent + 2 stacked).
   - 4-image 2x2 grid.
   - 5+ images with semi-transparent overlay on the 4th tile displaying `+N` additional photos.

3. **Interactions & Discussion Threads**:
   - Optimistic Likes toggling with heart animation.
   - Comments & nested reply-to workflow (`CommentList`).
   - Reposts counter toggle.
   - Bookmarking posts.
   - Native Share sheet invocation (`Share.share`).

4. **Authentication & Security**:
   - Dedicated sign-in, registration, and password recovery screens.
   - Native token storage via `expo-secure-store` with safe platform fallbacks.

5. **Laravel Backend Integration**:
   - Configurable API client powered by `axios`.
   - Automatic Bearer token attachment via request interceptors.
   - 401 automatic session cleanup and re-login routing.

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js (v18 or v20+)
- **Expo Go** app installed on your physical Android device (from Google Play Store) or iPhone (from Apple App Store).

### 2. Install Dependencies
Navigate into the `mobile` directory:

```bash
cd mobile
npm install
```

### 3. Configure the Backend URL
Create a `.env` file inside the `mobile` directory:

```bash
# For physical Android device on same Wi-Fi:
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8000/api

# For Android Emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api

# For iOS Simulator:
# EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Start the Expo Development Server

```bash
npx expo start
```

### 5. Open on Your Phone
- **Android**: Open the **Expo Go** app and scan the QR code displayed in your terminal.
- **iOS**: Open the Camera app and scan the QR code to launch in Expo Go.
- **Android Emulator**: Press `a` in your terminal.
- **iOS Simulator**: Press `i` in your terminal.

---

## 📂 Project Architecture

```
mobile/
├── app/                      # Expo Router navigation routes
│   ├── _layout.tsx           # Root provider stack & theme
│   ├── index.tsx             # Auth router redirector
│   ├── (auth)/               # Guest / authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/               # Bottom tab navigation screens
│   │   ├── index.tsx         # Home feed
│   │   ├── explore.tsx       # Search & Pakistan trends
│   │   ├── create.tsx        # Post composer with image picker
│   │   ├── notifications.tsx # Alerts
│   │   └── profile.tsx       # User profile
│   ├── post/
│   │   └── [id].tsx          # Post conversation thread
│   └── settings/
│       ├── account.tsx       # Profile info & privacy
│       └── display.tsx       # Appearance & theme
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable native UI components (Avatar, Button)
│   │   └── posts/            # PostCard, MediaCollage, CommentList
│   ├── constants/            # Brand emerald design tokens & spacing
│   ├── context/              # AuthContext & session state
│   ├── data/                 # Seed Pakistani trends & creators
│   ├── services/
│   │   ├── api/              # Axios client & Laravel endpoints
│   │   └── storage/          # SecureStore token storage
│   └── types/                # TypeScript interfaces
├── app.json                  # Expo native configuration & permissions
├── package.json              # Mobile dependencies
└── tsconfig.json             # TypeScript path mappings
```
