# **App Name**: ChannelVista

## Core Features:

- User Authentication & Profile Management: Secure user registration (username/password, Google Login) and authentication, including password hashing. Users can manage their profile photo, bio, and view their posts and followers count.
- Photo & Caption Posting: Allow users to upload photos, which are automatically cropped to a 9:16 aspect ratio. Users can add a text caption to each post. Photos are optimized, compressed, and stored using Supabase/Firebase.
- AI-Powered Captioning Tool: A generative AI tool that converts a user's spoken words into text captions for their photo posts, streamlining content creation.
- Personalized Home Feed: Displays a feed of the latest and trending posts from users and channels. Includes functionalities for liking, commenting, and sharing posts.
- Follow/Unfollow System: Enables users to follow and unfollow other channels, dynamically updating their personalized feed content and the follower count on profiles.
- Admin Moderation Panel (MVP): A foundational dashboard allowing administrators to manage user accounts and delete posts that violate content policies, ensuring a safe platform.
- Monetization Eligibility Tracker: Visually displays a user's current follower count and highlights when they reach the 5000-follower threshold required for monetization eligibility.

## Style Guidelines:

- Primary color: A sophisticated deep violet (#7953C6) chosen for its creative yet professional feel, suitable for a visually driven social platform.
- Background color: A very light, subtle off-white (#F4F1F8), providing a clean and airy canvas that is easy on the eyes and emphasizes visual content.
- Accent color: A vibrant electric blue (#3B7FFF), offering a clear contrast for interactive elements and call-to-actions, maintaining energy and clarity.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, clean, and slightly tech-inspired aesthetic, ideal for strong, impactful titles. Body text font: 'Inter' (sans-serif) chosen for its excellent readability and versatility across various screen sizes, ensuring clear communication in a mobile-first design.
- Utilize minimalist and intuitive vector icons for navigation (Home, Upload, Profile) and interactions (Like, Comment, Share) to maintain a clean mobile-first UI.
- Mobile-first layout featuring a fixed bottom navigation bar with three primary sections (Home, Upload, Profile). Content area transitions between full-screen pages rather than vertical scrolling, for a true Single Page Application (SPA) experience. Desktop view features a consistent left-hand sidebar navigation.
- Smooth, fluid transitions between screens to enhance the single-page application feel and improve user experience, avoiding jarring changes. Subtle hover and tap effects on interactive elements.