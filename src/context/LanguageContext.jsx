/* @refresh reset */
import { useSyncExternalStore } from "react";

const translations = {
  en: {
    // ── Navbar ────────────────────────────────────────────────────────────────
    signUp: "Sign up",
    signOut: "Sign out",
    toggleTheme: "Toggle theme",
    navHome: "Home",
    navFeatures: "Features",
    navTutors: "Tutors",
    navReviews: "Reviews",
    navJoin: "Join",

    // ── Home page ─────────────────────────────────────────────────────────────
    heroTag: "Smart tutor platform",
    heroHeadline: "Find and manage tuition in one clean workspace.",
    heroSubtitle:
      "Smart Tuition Finder helps students and parents compare verified tutors, filter by subject and location, and start conversations from a simple SaaS-style dashboard.",
    getStarted: "Get Started",
    seeHowItWorks: "See how it works",
    learnMore: "Learn more",
    verifiedTutors: "verified tutors",
    studentInquiries: "student inquiries",
    avgRating: "average rating",

    heroHeadline2: "Tuition. Simplified.",
    heroSubtitle2:
      "A calm, modern way to discover tutors, compare profiles, and choose the right learning support without clutter.",

    // ── Home component specific ─────────────────────────────────────────────
    searchLabel: "Search",
    matchByHeadline: "Match by what matters.",
    subjectLabel: "Subject",
    areaLabel: "Area",
    levelLabel: "Level",
    recommendedMatch: "Recommended match",
    tutorShortlist: "Tutor shortlist",
    cleanProfilesHeadline: "Clean profiles. Clear choices.",
    nearbyCount: "{count} nearby",

    builtForEveryStage: "Built for every learning stage",
    levelSchool: "School",
    levelAL: "A/L",
    levelUniversity: "University",
    levelProfessional: "Professional Skills",

    exploreSubjectsTag: "Explore subjects",
    popularSubjectsHeadline: "Every subject feels easy to find.",
    popularSubjectsDesc:
      "Clean subject cards keep the search focused, readable, and fast from the first click.",

    featuredTutorsTag: "Featured tutors",
    featuredTutorsHeadline: "Profiles with just enough detail.",
    viewAllTutors: "View all tutors →",
    noFeaturedTutors: "No featured tutor profiles are available yet.",

    howItWorksTag: "How it works",
    howItWorksHeadline: "A cleaner way to choose tuition",

    yearsExperience: "Years of Learning Experience",
    studentsEnrolled: "Students Enrolled",
    experiencedTeachers: "Experienced Teachers",

    designedForFocusTag: "Designed for focus",
    designedForFocusHeadline: "Everything feels calm, clear, and intentional.",

    joinPlatformTag: "Join the platform",
    joinPlatformHeadline: "One polished place for learners and tutors",
    joinPlatformDesc:
      "Join as a student to discover the right tutor, or as a tutor to turn your expertise into a stronger teaching profile.",
    forStudents: "For Students",
    forTutors: "For Tutors",
    studentFindDesc: "Find tutors by subject, location, and level with less effort.",
    tutorCreateDesc: "Create your profile and connect with quality students quickly.",
    studentSignUp: "Student Sign Up",
    tutorSignUp: "Tutor Sign Up",

    studentFindTitle: "Find the tutor that fits your goals.",
    studentFindLongDesc:
      "Compare subject fit, location, ratings, and teaching style in a clean experience.",
    tutorPresentTitle: "Present your teaching beautifully.",
    tutorPresentDesc:
      "Build a profile that helps students understand your strengths at a glance.",

    ctaHeadline: "Build better learning outcomes today",
    ctaDesc:
      "Smart Tuition Finder brings students, parents, and tutors together through a calm, modern platform.",
    ctaHeadline2: "Ready when you are.",
    ctaDesc2:
      "Start with a cleaner way to discover tutors and build better learning outcomes.",
    joinSmartTuition: "Join Smart Tuition Finder",

    // ── Platform steps ────────────────────────────────────────────────────────
    step1Title: "Tell us the goal",
    step1Desc: "Choose the subject, level, city, and learning style that fit you.",
    step2Title: "Compare trusted tutors",
    step2Desc: "Review verified profiles, ratings, locations, and specialties in minutes.",
    step3Title: "Start with confidence",
    step3Desc: "Connect quickly and keep momentum with the right learning support.",

    // ── Highlights ────────────────────────────────────────────────────────────
    highlight1Title: "Verified Tutor Profiles",
    highlight1Desc: "View qualifications, experience, and teaching style in one place.",
    highlight2Title: "Smart Local Search",
    highlight2Desc: "Find tutors by city and nearby area for faster onboarding.",
    highlight3Title: "Fast Communication",
    highlight3Desc: "Send direct inquiries and get responses without platform friction.",

    // ── Subjects ──────────────────────────────────────────────────────────────
    subjectMaths: "Maths",
    subjectMathsBlurb: "Algebra, calculus, statistics & competition prep.",
    subjectScience: "Science",
    subjectScienceBlurb: "Biology, chemistry & lab-ready experiments.",
    subjectHistory: "History",
    subjectHistoryBlurb: "Sri Lanka, world history & critical analysis.",
    subjectArt: "Art",
    subjectArtBlurb: "Drawing, painting, design & portfolio building.",
    subjectEnglish: "English",
    subjectEnglishBlurb: "Grammar, literature, IELTS & spoken fluency.",
    subjectPhysics: "Physics",
    subjectPhysicsBlurb: "Mechanics, electromagnetism & A/L mastery.",

    // ── Join modal ────────────────────────────────────────────────────────────
    joinUs: "Join Us",
    createAccountPrompt: "Create your Smart Tuition Finder account",
    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    iAmJoiningAs: "I am joining as",
    student: "Student",
    tutor: "Tutor",
    signUpBtn: "Sign Up",
    signingUp: "Signing Up...",
    registrationSuccessful: "Registration Successful!",
    welcomeToStf: "Welcome to Smart Tuition Finder.",

    // ── Login pages ───────────────────────────────────────────────────────────
    studentLoginTitle: "Welcome back",
    studentLoginSubtitle:
      "Sign in with your student account to browse tutors and keep track of your learning.",
    tutorLoginTitle: "Welcome back",
    tutorLoginSubtitle:
      "Sign in to your tutor dashboard to manage sessions, students, and your profile.",

    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",

    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    passwordRequired: "Password is required.",

    continueWithEmail: "Continue with Email",
    signingIn: "Signing you in...",
    forgotPassword: "Forgot your password?",
    accountCreated:
      "Account created. Sign in with your email and password below.",

    noAccount: "Don't have an account?",
    createStudentAccount: "Create a student account",
    areYouTutor: "Are you a tutor?",
    tutorSignIn: "Tutor sign in",

    dontHaveAccount: "Don't have an account?",
    createTutorAccount: "Create a tutor account",
    lookingForTutor: "Looking for a tutor as a student?",
    studentSignIn: "Student sign in",

    invalidCredentials: "Invalid email or password.",
    tooManyAttempts: "Too many attempts. Please wait a moment and try again.",
    somethingWentWrong: "Something went wrong. Please try again.",

    studentAsideTitle: "Find your perfect tutor in minutes.",
    studentAsideDesc:
      "Sign in to browse verified tutors, save favourites, and manage your learning from one dashboard.",
    studentAsideItems: [
      "Browse tutors across Sri Lanka",
      "Message tutors and track your progress",
      "Your student dashboard after sign-in",
    ],

    tutorAsideHeading1: "Teach what you love.",
    tutorAsideHeading2: "Grow your student base.",
    tutorAsideDesc:
      "Join hundreds of Sri Lankan tutors already using Smart Tuition Finder to fill their calendars and get discovered by motivated students.",
    tutorAsideItems: [
      "Verified profile with demo videos",
      "Smart matching with nearby students",
      "Built-in session scheduling",
    ],

    // ── Footer ────────────────────────────────────────────────────────────────
    footerDesc:
      "Find trusted tutors, compare profiles, and connect with the right learning support faster.",
    footerProductTitle: "Product",
    footerResourcesTitle: "Resources",
    footerOverview: "Overview",
    footerFeatures: "Features",
    footerTutors: "Tutors",
    footerJoin: "Join",
    footerStudentLogin: "Student Login",
    footerTutorLogin: "Tutor Login",
    footerSignUp: "Sign up",
    footerStayUpdated: "Stay up to date",
    footerEmailPlaceholder: "Enter your email",
    footerSubscribe: "Subscribe",
    footerAllRightsReserved: "All rights reserved.",

    // ── Tutor dashboard ───────────────────────────────────────────────────────
    tutorDashboardLabel: "Tutor dashboard",
    studentDashboardLabel: "Student dashboard",
    welcomeBack: "Welcome back",
    loading: "Loading…",
    editProfile: "Edit profile",
    publicProfile: "Public profile",
    proPlan: "Pro plan",
    signOutBtn: "Sign out",
    signingOut: "Signing out…",

    activeStudents: "Active students",
    sessionsThisWeek: "Sessions this week",
    averageRating: "Average rating",
    payingSubscribers: "paying subscribers",
    liveMeetingsSub: "live meetings",
    reviews: "reviews",
    review: "review",

    liveClasses: "Live Classes",
    newMeeting: "New meeting",
    creating: "Creating…",
    noMeetingsYet: "No meetings yet",
    noMeetingsDesc: 'Click "New meeting" to get started',
    joinRoom: "Join room",
    joinClass: "Join class",
    join: "Join",

    profileSection: "Profile",
    nameLabel: "Name",
    emailLabel: "Email",
    roleLabel: "Role",
    accountLabel: "Account",
    verifiedTutorRole: "Verified tutor",
    studentRole: "Student",
    quickLinks: "Quick links",
    manageMeetings: "Manage meetings",
    upgradeToPro: "Upgrade to Pro",
    viewPublicProfile: "View public profile",

    // ── Student dashboard ─────────────────────────────────────────────────────
    liveMeetingsLabel: "Live meetings",
    savedTutorsLabel: "Saved tutors",
    activeSubscriptions: "Active subscriptions",
    fromSubscribedTutors: "from subscribed tutors",
    onYourList: "on your list",
    tutorChannels: "tutor channels",

    noLiveMeetingsYet: "No live meetings yet",
    noLiveDesc1: "Subscribe to a tutor to join their live classes",
    noLiveDesc2: "Your tutor hasn't started a meeting yet",

    messages: "Messages",
    noMessagesYet: "No messages yet",
    messageTutorHint: "Message a tutor from their profile page",
    noMessagesStudentHint: "Message a tutor from their profile page",

    savedTutorsTitle: "Saved tutors",
    browse: "Browse",
    noSavedTutors:
      "No saved tutors yet — tap the heart on any tutor profile to save them.",
    tips: "Tips",
    tipsDesc:
      "Use filters on the tutor directory to match subject, level, and location. Favourite tutors you like so you can find them quickly.",

    tutorInvitedYou: "Your tutor invited you to",
    inviteReceived: "Invite received",
    liveNow: "Live now",
    live: "Live",

    findTutors: "Find tutors",

    // ── All Tutors page ───────────────────────────────────────────────────────
    allTutorsHeadline: "Find your tutor",
    allTutorsDesc: "Browse verified tutors across Sri Lanka.",
    searchPlaceholder: "Search by name, subject…",
    clearSearch: "Clear search",
    allSubjects: "All Subjects",
    subjectBiology: "Biology",
    subjectICT: "ICT",
    subjectBusiness: "Business",
    anyPrice: "Any price",
    anyRating: "Any rating",
    highestRated: "Highest rated",
    priceLowToHigh: "Price: low to high",
    priceHighToLow: "Price: high to low",
    nameAZ: "Name (A → Z)",
    noTutorsFound: "No tutors found matching your filters.",
    tutorsMatchFilters_one: "{count} tutor matches your filters",
    tutorsMatchFilters_many: "{count} tutors match your filters",
    tutorsEmptyHint:
      "Try widening the price range, lowering the rating threshold, or switching to a different subject.",
    resetFilters: "Reset filters",
    viewProfile: "View profile",
    generalSubject: "General",
    featuredBadge: "Featured",
    verifiedBadge: "Verified",
    newTutor: "New tutor",
    fromLabel: "From",
    rateOnProfile: "Rate on profile",
    perHourShort: "/hr",

    // ── Tutor profile page ───────────────────────────────────────────────────
    loadingTutorProfile: "Loading tutor profile...",
    profileBoostBadge: "Profile Boost",
    yearsExperienceShort: "{count}+ years experience",
    bookSession: "Book Session",
    messageButton: "Message",
    whatsappButton: "WhatsApp",
    processingEllipsis: "Processing…",
    subscribeLiveClasses: "Subscribe for live classes",
    saved: "Saved",
    saveTutor: "Save tutor",

    unavailable: "Unavailable",
    bookNowWithSelection: "Book Now · {slot}",
    selectSlotToBook: "Select a slot to book",

    thanksForReview: "Thanks for your review!",
    leaveReview: "Leave a review",
    reviewPlaceholder: "Share your experience (optional)…",
    submittingEllipsis: "Submitting…",
    submitReview: "Submit review",

    messageTutorTitle: "Message {name}",
    messageTutorPlaceholder:
      "Hi {name}, I saw your profile on Smart Tuition Finder…",
    cancel: "Cancel",
    sendingEllipsis: "Sending…",

    tutorNotFoundTag: "404 · Tutor not found",
    tutorNotFoundHeadline: "We couldn't find that tutor.",
    tutorNotFoundDesc:
      "The tutor you're looking for may have moved or is no longer active on Smart Tuition Finder. Try browsing the featured tutors on the homepage.",
    backToHomepage: "Back to homepage",

    signInStudentToSaveTutorsToast: "Sign in as a student to save tutors.",
    removedFromSavedToast: "Removed from saved tutors.",
    tutorSavedToast: "Tutor saved to your list!",
    couldNotUpdateSavedToast: "Could not update saved status.",
    sessionBookedForToast: "Session booked for {slot} 🎉",
    selectSlotBelowToast: "Please select a slot below to continue.",
    whatsAppNumberNotAvailableToast:
      "WhatsApp number is not available for this tutor.",
    signInStudentToSubscribeToast:
      "Please sign in as a student to subscribe.",
    paymentReceivedToast:
      "Payment received. Subscription activates after secure verification.",
    subscriptionCancelledToast: "Subscription payment cancelled.",
    paymentFailedToast: "Payment failed: {error}",
    couldNotStartSubscriptionToast: "Could not start subscription checkout.",
    signInStudentToMessageTutorToast:
      "Sign in as a student to message this tutor.",
    messageSentToast: "Message sent!",

    shareTutorProfileText: "Check out {name} on Smart Tuition Finder",
    whatsAppIntroMessage:
      "Hi {name}, I found your profile on Smart Tuition Finder.",

    profileAboutTitle: "About the tutor",
    profileAboutEmpty: "This tutor has not added an About section yet.",
    qualificationsTitle: "Qualifications & Experience",
    qualificationsEmpty: "No qualifications or experience details added yet.",
    subjectsGradesTitle: "Subjects & Grades",
    subjectsGradesEmpty: "No subjects or grade levels added yet.",
    subjectGeneric: "Subject",
    demoVideosTitle: "Demo videos",
    videosCount: "{count} videos",
    demoVideosEmpty: "No demo videos added yet.",
    studentReviewsTitle: "Student reviews",
    noReviewsYet: "No reviews yet. Be the first to leave one!",
    anonymous: "Anonymous",
    availabilityBookingTitle: "Availability & Booking",
    availabilityNotAddedEmpty: "Availability details have not been added yet.",

    // ── Form validation & auth ─────────────────────────────────────────────────
    fullNamePlaceholder: "e.g. Priya Wickramasinghe",
    pleaseEnterFullName: "Please enter your full name.",
    emailAddressLabel: "Email address",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    confirmPassword: "Re-enter your password",
    passwordAtLeast8: "At least 8 characters",
    passwordStrengthHint: "Use 8+ characters with letters and numbers.",
    passwordsNotMatch: "Passwords don't match.",
    agreeToTerms: "I agree to the Terms and Privacy Policy",
    acceptTermsRequired: "Please accept the Terms and Privacy Policy.",
    createAccount: "Create account",
    createStudentAccountBtn: "Create student account",
    createTutorAccountBtn: "Create tutor account",

    // ── Signup page ────────────────────────────────────────────────────────────
    studentsAndTutorsStartHere: "Students and tutors start here.",
    signupAsideDesc: "Create a free account in one place. Switch between student and tutor registration anytime before you submit.",
    roleSpecificDashboards: "Role-specific dashboards after sign-in",
    secureEmailSignup: "Secure email and password sign-up",
    builtForSriLanka: "Built for learners and educators in Sri Lanka",
    chooseStudentOrTutor: "Choose student or tutor, then complete the form below.",

    // ── Student register ───────────────────────────────────────────────────────
    findPerfectTutorMinutes: "Find your perfect tutor in minutes.",
    studentRegisterAside: "Create a free student account to browse, save and connect with the best tutors near you — all from a single dashboard.",
    discoverVerifiedTutors: "Discover verified tutors across Sri Lanka",
    filterBySubjectGrade: "Filter by subject, grade, location and budget",
    saveFavouriteTutors: "Save favourite tutors and message them instantly",
    trackLearningJourney: "Track your learning journey from one dashboard",
    displayNameLabel: "Display name",
    bioLabel: "Bio",
    addShortBio: "Add a short bio so tutors understand your learning goals before they reply.",
    bioPlaceholder: "A few lines about your level, goals, and what you're looking for in a tutor.",
    charactersRemaining: "/600 characters",

    // ── Student profile edit ───────────────────────────────────────────────────
    yourStudentProfile: "Your student profile",
    keepProfileUpToDate: "Keep your profile up to date",
    profileHelpText: "Your name and bio help tutors recognise you. Changes save automatically.",
    profileBasics: "Profile basics",
    profileBasicsDesc: "Name and a short bio tutors see when you contact them.",
    loadingProfile: "Loading your profile…",
    backToDashboard: "Back to dashboard",

    // ── Tutor register ────────────────────────────────────────────────────────
    tutorRegisterAside: "Teach what you love. Grow your student base.",

    // ── Tutor profile edit ─────────────────────────────────────────────────────
    editTutorProfile: "Edit Tutor Profile",
    yourTutorProfile: "Your tutor profile",

    // ── Tutor own profile ──────────────────────────────────────────────────────
    loadingProfileEllipsis: "Loading your profile...",

    // ── Tutor Pro plan ────────────────────────────────────────────────────────
    proPlusTitle: "Pro Plus",
    proMaxTitle: "Pro Max",
    growthPlanForTutors: "Growth plan for active tutors",
    maximumVisibilityForTutors: "Maximum visibility for serious tutors",
    profileBoostInSearch: "Profile boost in tutor search",
    verifiedBlueMark: "Verified blue mark on tutor card and profile",
    priorityPlacement: "Priority placement in subject categories",
    basicProAnalytics: "Basic Pro analytics dashboard",
    everythingInProPlus: "Everything in Pro Plus",
    strongerBoostInLists: "Stronger boost in lists and featured rows",
    prioritySupportResponse: "Priority support response",
    advancedLeadInsights: "Advanced lead insights and conversion trends",
    payWithPayHere: "Pay with PayHere",
    paymentSuccessful: "Payment successful",
    paymentCompletedDbFailed: "Payment completed, but database update failed",
    paymentCancelled: "Payment cancelled.",
    paymentError: "PayHere error",
    proStatusActivated: "Verified blue mark and profile boost are now active.",

    // ── Payment status page ────────────────────────────────────────────────────
    paymentFailed: "Payment failed or cancelled",
    subscriptionActivationSoon: "Your payment has been received. Subscription activation will be confirmed shortly.",
    proStatusUpdateSoon: "Your payment has been received. Your Pro status update will be confirmed shortly.",
    paymentNotCompleted: "Your payment was not completed. Please try again.",
    backToTutorProfiles: "Back to tutor profiles",
    backToProPlans: "Back to Pro Plans",
    goToDashboard: "Go to Dashboard",

    // ── Tutor profile ─────────────────────────────────────────────────────────
    noDetailsAddedYet: "No details added yet.",
    ratePerhour: "/ hour",
    rateNotSet: "Rate not set",
    removeBookmark: "Remove bookmark",
    saveTutorBookmarks: "Save this tutor to bookmarks",
    reviewsCount: "reviews",

    // ── Live join page ────────────────────────────────────────────────────────
    loadingMeeting: "Loading meeting...",
    meetingNotFound: "Meeting not found.",
    meetingPasscode: "Meeting passcode (if required)",
    enterPasscode: "Enter passcode",

    // ── Tutor live meeting ─────────────────────────────────────────────────────
    loadingRoom: "Loading room…",
    meetingNotFoundHost: "Meeting not found or you are not the host.",
    copied: "Copied",
    copyInvite: "Copy invite",
    passcode: "Passcode",
    goLive: "Go live",
    meetingEnded: "Meeting ended",
    sessionFinished: "This session has finished.",
    scheduled: "Scheduled",
    ended: "Ended",
    setPasscodeOptional: "Set passcode (leave empty to remove)",
    save: "Save",
    setPasscodePlaceholder: "e.g. 123456",

    // ── Tutor live host ───────────────────────────────────────────────────────
    hostLiveClasses: "Host live classes",
    createRunLiveLessons: "Create and run live lessons directly in Smart Tuition Finder.",
    checkingProAccess: "Checking your Pro access...",
    tutorProRequired: "Tutor Pro is required to host live classes.",
    upgradeNow: "Upgrade now",
    createMeeting: "Create meeting",
    meetingTitle: "Title",
    meetingDescription: "Description",
    meetingPasscodeOptional: "Meeting passcode (optional)",
    enableWaitingRoom: "Enable waiting room",
    startsAt: "Starts at",
    endsAt: "Ends at",

    // ── Live chat panel ───────────────────────────────────────────────────────
    liveChat: "Live chat",
    askQuestionInClass: "Ask a question in the live class...",
    sendMessage: "Send message",

    // ── Polls & QA panel ───────────────────────────────────────────────────────
    polls: "Polls",
    pollQuestion: "Poll question",
    oneOptionPerLine: "One option per line",
    createPoll: "Create poll",
    closePoll: "Close poll",
    qa: "Q&A",
    askQuestion: "Ask a question...",
    ask: "Ask",
    answered: "Answered",
    markAnswered: "Mark answered",

    // ── Raise hand panel ───────────────────────────────────────────────────────
    raiseHand: "Raise hand",
    lowerHand: "Lower hand",
    you: "You",
    raised: "Raised",
    idle: "Idle",

    // ── Participant grid ───────────────────────────────────────────────────────
    guest: "Guest",
    screen: "Screen",

    // ── FAQ ────────────────────────────────────────────────────────────────────
    frequentlyAskedQuestions: "Frequently Asked Questions",
    faqSubtitle: "Quick answers about finding tutors, registering, profiles, and using Smart Tuition Finder.",
    howFindRightTutor: "How do I find the right tutor?",
    howFindRightTutorAns: "Use our advanced filters to search by subject, level, and location. Read tutor profiles and reviews to compare qualifications and teaching styles.",
    areTutorProfilesVerified: "Are tutor profiles verified?",
    areTutorProfilesVerifiedAns: "Yes, all tutors on Smart Tuition Finder go through a verification process. Look for the verified badge on their profile.",
    howLongRegistration: "How long does registration take?",
    howLongRegistrationAns: "Registration takes 2-3 minutes. Fill in your details, create a password, and you can start browsing tutors immediately.",
    canTutorsEditProfile: "Can tutors edit their profile later?",
    canTutorsEditProfileAns: "Yes, tutors can update their profile information, rates, availability, and profile picture anytime from their dashboard.",
    canStudentsSaveTutors: "Can students save or compare tutors?",
    canStudentsSaveTutorsAns: "Absolutely! Students can save tutors to their favorites and compare multiple profiles before making a decision.",
    howStudentsContactTutors: "How do students contact tutors?",
    howStudentsContactTutorsAns: "Students can send direct messages to tutors from their profile page. Tutors typically respond within 24 hours.",
    whatSubjectsSupported: "What subjects are supported?",
    whatSubjectsSupportedAns: "We support Maths, Science, English, History, Art, Physics, Biology, ICT, and many other subjects for all levels.",
    isThereFee: "Is there a fee to use the platform?",
    isThereFeAns: "Creating an account and browsing tutors is completely free. Some tutors offer premium features or subscription-based sessions.",
    whoCanJoinAsTutor: "Who can join as a tutor?",
    whoCanJoinAsTutorAns: "Any qualified educator or experienced tutor can join. We review profiles to ensure quality and safety for all users.",

    // ── Supabase setup notice ──────────────────────────────────────────────────
    supabaseNotConfigured: "Supabase not configured",
    supabaseSetupInstructions: "Add your Supabase URL and anon key to `.env.local` (see `.env.example`), then run `supabase/schema.sql` in the SQL editor to enable sign-up and login.",
    supabaseIsntConfigured: "Supabase isn't configured",
    addSupabaseUrl: "Add your Supabase URL and key to `.env.local` and restart the dev server.",

    // ── Auth layout aside ──────────────────────────────────────────────────────
    teachWhatYouLove: "Teach what you love.",
    growYourStudentBase: "Grow your student base.",
    tutorLayoutAside: "Join hundreds of Sri Lankan tutors already using Smart Tuition Finder to fill their calendars and get discovered by motivated students.",
    verifiedProfileVideos: "Verified profile with demo videos",
    smartMatchingStudents: "Smart matching with nearby students",
    builtInSessionScheduling: "Built-in session scheduling",

    // ── Form field ─────────────────────────────────────────────────────────────
    showPasswordBtn: "Show password",
    hidePasswordBtn: "Hide password",

    // ── Gemini chatbot ────────────────────────────────────────────────────────
    messageCouldntProcess: "That message couldn't be processed. Try asking in different words.",
    replyFiltered: "The reply was filtered. Try a shorter or a more general question.",
    noReplyText: "No reply text came back. Another model may work.",
    assistantNotConfigured: "The assistant isn't configured yet. Add VITE_GEMINI_API_KEY to `.env.local`, restart the dev server, then try again.",
    googleFreeQuotaExceeded: "Google's free quota for this API has been exceeded. Add a billing account to Google Cloud to continue.",

    // ── Site header ────────────────────────────────────────────────────────────
    smartTuitionFinder: "Smart Tuition Finder",
    findLearnGrow: "Find · Learn · Grow",
    courses: "Courses",
    dashboard: "Dashboard",

    // ── Tutor directory filters ────────────────────────────────────────────────
    tutorDirectory: "Tutor directory",
    findYourNextTutor: "Find your next tutor.",
    searchByNameSubject: "Search by name, subject, or city, then refine the list with simple filters that stay out of the way.",
    underLKR3000: "Under LKR 3 000",
    lkr3000To4500: "LKR 3 000 – 4 500",
    overLKR4500: "Over LKR 4 500",
    rating4Point5: "4.5+",
    rating4Point8: "4.8+",
    rating5: "5.0",
  },

  // ════════════════════════════════════════════════════════════════════════════
  si: {
    // ── Navbar ────────────────────────────────────────────────────────────────
    signUp: "ලියාපදිංචි වන්න",
    signOut: "ඉවත් වන්න",
    toggleTheme: "තේමාව මාරු කරන්න",
    navHome: "මුල් පිටුව",
    navFeatures: "විශේෂාංග",
    navTutors: "ගුරුවරුන්",
    navReviews: "සමාලෝචන",
    navJoin: "එකතු වන්න",

    // ── Home page ─────────────────────────────────────────────────────────────
    heroTag: "Smart ගුරු platform",
    heroHeadline: "එක් workspace එකක ටියුෂන් සොයා ගෙන කළමනාකරණය කරන්න.",
    heroSubtitle:
      "Smart Tuition Finder මඟින් සිසුන්ට හා දෙමාපියන්ට සත්‍යාපිත ගුරුවරුන් සංසන්දනය කිරීමට, විෂය හා ස්ථාන අනුව පෙරහන් කිරීමට සහ dashboard එකෙන් සෘජුව කතා කිරීමට හැකිය.",
    getStarted: "ආරම්භ කරන්න",
    seeHowItWorks: "ක්‍රියා කරන ආකාරය බලන්න",
    learnMore: "තව දැනගන්න",
    verifiedTutors: "සත්‍යාපිත ගුරුවරුන්",
    studentInquiries: "සිසු විමසීම්",
    avgRating: "සාමාන්‍ය ශ්‍රේණිගත කිරීම",

    heroHeadline2: "ටියුෂන්. සරල ලෙස.",
    heroSubtitle2:
      "ගුරුවරුන් සොයා ගැනීමට, ප්‍රොෆයිල් සංසන්දනය කිරීමට සහ නිවැරදි ඉගෙනුම් සහාය තෝරා ගැනීමට නිරව, නවීන ක්‍රමයක්.",

    builtForEveryStage: "සෑම ඉගෙනුම් අදියරකටම",
    levelSchool: "පාසල",
    levelAL: "අ.පො.ස. (උ.පෙ.)",
    levelUniversity: "විශ්වවිද්‍යාල",
    levelProfessional: "වෘත්තීය කුසලතා",

    searchLabel: "සොයන්න",
    matchByHeadline: "වැදගත් දෙයින් ගැළපෙන්නාය.",
    subjectLabel: "විෂය",
    areaLabel: "ප්‍රදේශ",
    levelLabel: "මට්ටම",
    recommendedMatch: "නිර්දේශිත ගැළපීම",
    tutorShortlist: "ගුරු කෙටි ලැයිස්තුව",
    cleanProfilesHeadline: "පිරිසිදු ප්‍රොෆයිල. පැහැදිලි තේරීම්.",
    nearbyCount: "ආසන්නයේ {count}",

    exploreSubjectsTag: "විෂයයන් ගවේෂණය කරන්න",
    popularSubjectsHeadline: "සෑම විෂයයක්ම සොයා ගැනීම පහසු.",
    popularSubjectsDesc:
      "පිරිසිදු විෂය කාඩ් ලේඛනය කෙටිව, කියවිය හැකි ලෙස සහ ඉක්මන් ලෙස තබා ගනී.",

    featuredTutorsTag: "ප්‍රමුඛ ගුරුවරුන්",
    featuredTutorsHeadline: "ප්‍රමාණවත් විස්තර සහිත ප්‍රොෆයිල.",
    viewAllTutors: "සියලු ගුරුවරුන් බලන්න →",
    noFeaturedTutors: "ප්‍රමුඛ ගුරු ප්‍රොෆයිල කිසිවක් නැත.",

    howItWorksTag: "ක්‍රියා කරන ආකාරය",
    howItWorksHeadline: "ටියුෂන් තෝරා ගැනීමේ පිරිසිදු ක්‍රමය",

    yearsExperience: "ඉගෙනුම් අත්දැකීම් වසර",
    studentsEnrolled: "ලියාපදිංචි සිසුන්",
    experiencedTeachers: "පළපුරුදු ගුරුවරුන්",

    designedForFocusTag: "අවධානය සඳහා නිර්මාණය",
    designedForFocusHeadline: "සෑම දෙයක්ම සාමකාමී, පැහැදිලි හා අරමුදල් ලත්.",

    joinPlatformTag: "platform එකට එකතු වන්න",
    joinPlatformHeadline: "ඉගෙනන්නන් හා ගුරුවරුන් සඳහා එක් ස්ථානයක්",
    joinPlatformDesc:
      "නිවැරදි ගුරුවරයා සොයා ගැනීමට සිසුවෙකු ලෙස හෝ ඔබේ ගුරු ප්‍රොෆයිලය ශක්තිමත් කිරීමට ගුරුවරයෙකු ලෙස ලියාපදිංචි වන්න.",
    forStudents: "සිසුන් සඳහා",
    forTutors: "ගුරුවරුන් සඳහා",
    studentFindDesc: "විෂය, ස්ථාන සහ මට්ටම අනුව ගුරුවරුන් ලේසියෙන් සොයන්න.",
    tutorCreateDesc: "ඔබේ ප්‍රොෆයිලය සාදා ගෙන ගුණාත්මක සිසුන් සමඟ ඉක්මනින් සම්බන්ධ වන්න.",
    studentSignUp: "සිසු ලියාපදිංචිය",
    tutorSignUp: "ගුරු ලියාපදිංචිය",

    studentFindTitle: "ඔබේ ඉලක්ක සපුරාලන ගුරුවරයා සොයා ගන්න.",
    studentFindLongDesc:
      "විෂය ගැළපුම, ස්ථාන, ශ්‍රේණිගත කිරීම් සහ ඉගැන්වීම් විලාශය පිරිසිදු ලෙස සංසන්දනය කරන්න.",
    tutorPresentTitle: "ඔබේ ඉගැන්වීම ලස්සනට ඉදිරිපත් කරන්න.",
    tutorPresentDesc:
      "සිසුන්ට ඔබේ ශක්තිමත්කම් ඉක්මනින් තේරෙන ප්‍රොෆයිලයක් ගොඩ නඟන්න.",

    ctaHeadline: "අද වඩා හොඳ ඉගෙනුම් ප්‍රතිඵල ගොඩ නඟන්න",
    ctaDesc:
      "Smart Tuition Finder සිසුන්, දෙමාපියන් සහ ගුරුවරුන් නිශ්චල, නවීන platform එකක් හරහා එකිනෙකා සමඟ සම්බන්ධ කරයි.",
    ctaHeadline2: "ඔබ සූදානම් වූ විට.",
    ctaDesc2:
      "ගුරුවරුන් සොයා ගැනීමේ පිරිසිදු ක්‍රමයෙන් ආරම්භ කර වඩා හොඳ ඉගෙනුම් ප්‍රතිඵල ලබා ගන්න.",
    joinSmartTuition: "Smart Tuition Finder ට එකතු වන්න",

    // ── Platform steps ────────────────────────────────────────────────────────
    step1Title: "ඉලක්කය කියන්න",
    step1Desc: "ඔබට ගැළপෙන විෂය, මට්ටම, නගරය සහ ඉගෙනුම් විලාශය තෝරන්න.",
    step2Title: "විශ්වාසදායක ගුරුවරුන් සංසන්දනය කරන්න",
    step2Desc: "සත්‍යාපිත ප්‍රොෆයිල, ශ්‍රේණිගත කිරීම්, ස්ථාන සහ විශේෂත්ව මිනිත්තු කිහිපයකින් සමාලෝචනය කරන්න.",
    step3Title: "විශ්වාසයෙන් ආරම්භ කරන්න",
    step3Desc: "ඉක්මනින් සම්බන්ධ වී නිවැරදි ඉගෙනුම් සහාය සමඟ ඉදිරියට ගන්න.",

    // ── Highlights ────────────────────────────────────────────────────────────
    highlight1Title: "සත්‍යාපිත ගුරු ප්‍රොෆයිල",
    highlight1Desc: "සුදුසුකම්, අත්දැකීම් සහ ඉගැන්වීම් විලාශය එක් ස්ථානයක බලන්න.",
    highlight2Title: "Smart දේශීය සෙවුම",
    highlight2Desc: "ඉක්මන් ලියාපදිංචිය සඳහා නගරය සහ ළඟ ප්‍රදේශය අනුව ගුරුවරුන් සොයන්න.",
    highlight3Title: "ඉක්මන් සන්නිවේදනය",
    highlight3Desc: "platform ගනුදෙනු නොමැතිව සෘජු විමසීම් යවා ප්‍රතිචාර ලබා ගන්න.",

    // ── Subjects ──────────────────────────────────────────────────────────────
    subjectMaths: "ගණිතය",
    subjectMathsBlurb: "බීජ ගණිතය, කලනය, සංඛ්‍යාන සහ තරඟ සූදානම.",
    subjectScience: "විද්‍යාව",
    subjectScienceBlurb: "ජීව විද්‍යාව, රසායන විද්‍යාව සහ ප්‍රාතිහාර්ය අත්හදා බැලීම්.",
    subjectHistory: "ඉතිහාසය",
    subjectHistoryBlurb: "ශ්‍රී ලංකා, ලෝක ඉතිහාසය සහ විවේචනාත්මක විශ්ලේෂණය.",
    subjectArt: "චිත්‍ර කලාව",
    subjectArtBlurb: "ඇඳීම, චිත්‍ර, නිර්මාණකරණය සහ portfolio ගොඩ නැඟීම.",
    subjectEnglish: "ඉංග්‍රීසි",
    subjectEnglishBlurb: "ව්‍යාකරණ, සාහිත්‍ය, IELTS සහ කථා ප්‍රවීණතාව.",
    subjectPhysics: "භෞතික විද්‍යාව",
    subjectPhysicsBlurb: "යාන්ත්‍ර විද්‍යාව, විද්‍යුතු චුම්බකත්වය සහ අ.පො.ස. ප්‍රවීණතාව.",

    // ── Join modal ────────────────────────────────────────────────────────────
    joinUs: "අප හා එකතු වන්න",
    createAccountPrompt: "ඔබේ Smart Tuition Finder ගිණුම සාදන්න",
    fullName: "සම්පූර්ණ නම",
    emailAddress: "විද්‍යුත් ලිපිනය",
    password: "මුරපදය",
    iAmJoiningAs: "මම ලියාපදිංචි වන්නේ",
    student: "සිසු",
    tutor: "ගුරු",
    signUpBtn: "ලියාපදිංචි වන්න",
    signingUp: "ලියාපදිංචි වෙමින්...",
    registrationSuccessful: "ලියාපදිංචිය සාර්ථකයි!",
    welcomeToStf: "Smart Tuition Finder ට සාදරයෙන් පිළිගනිමු.",

    // ── Login pages ───────────────────────────────────────────────────────────
    studentLoginTitle: "නැවත සාදරයෙන් පිළිගනිමු",
    studentLoginSubtitle:
      "ගුරුවරුන් ගවේෂණය කිරීමට සහ ඔබේ ඉගෙනුම ලුහුබඳීමට ඔබේ සිසු ගිණුමෙන් ඇතුළු වන්න.",
    tutorLoginTitle: "නැවත සාදරයෙන් පිළිගනිමු",
    tutorLoginSubtitle:
      "සැසි, සිසුන් සහ ඔබේ ප්‍රොෆයිලය කළමනාකරණය කිරීමට ගුරු dashboard එකට ඇතුළු වන්න.",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "ඔබේ මුරපදය ඇතුළු කරන්න",
    showPassword: "මුරපදය පෙන්වන්න",
    hidePassword: "මුරපදය සඟවන්න",
    emailRequired: "විද්‍යුත් ලිපිනය අවශ්‍යයි.",
    emailInvalid: "වලංගු විද්‍යුත් ලිපිනයක් ඇතුළු කරන්න.",
    passwordRequired: "මුරපදය අවශ්‍යයි.",
    continueWithEmail: "විද්‍යුත් ලිපිනයෙන් ඉදිරියට යන්න",
    signingIn: "ඇතුල් වෙමින්...",
    forgotPassword: "මුරපදය අමතකද?",
    accountCreated:
      "ගිණුම සාදන ලදී. පහත ඔබේ විද්‍යුත් ලිපිනය සහ මුරපදය ඇතුළු කරන්න.",
    noAccount: "ගිණුමක් නැද්ද?",
    createStudentAccount: "සිසු ගිණුමක් සාදන්න",
    areYouTutor: "ඔබ ගුරුවරයෙකුද?",
    tutorSignIn: "ගුරු පිවිසීම",
    dontHaveAccount: "ගිණුමක් නැද්ද?",
    createTutorAccount: "ගුරු ගිණුමක් සාදන්න",
    lookingForTutor: "සිසුවෙකු ලෙස ගුරුවරයෙකු සොයනවාද?",
    studentSignIn: "සිසු පිවිසීම",
    invalidCredentials: "අවලංගු විද්‍යුත් ලිපිනය හෝ මුරපදය.",
    tooManyAttempts: "වැඩිපුර උත්සාහ. කරුණාකර මොහොතකින් නැවත උත්සාහ කරන්න.",
    somethingWentWrong: "දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.",
    studentAsideTitle: "මිනිත්තු කිහිපයකින් ඔබේ පරිපූර්ණ ගුරුවරයා සොයා ගන්න.",
    studentAsideDesc:
      "සත්‍යාපිත ගුරුවරුන් බැලීමට, ප්‍රියතමයන් සුරැකීමට, සහ ඔබේ ඉගෙනුම කළමනාකරණය කිරීමට ඇතුළු වන්න.",
    studentAsideItems: [
      "ශ්‍රී ලංකාව පුරා ගුරුවරුන් ගවේෂණය කරන්න",
      "ගුරුවරුන් සමඟ පණිවිඩ හුවමාරු කර ප්‍රගතිය ලුහුබඳින්න",
      "ඇතුළු වීමෙන් පසු ඔබේ සිසු dashboard",
    ],
    tutorAsideHeading1: "ඔබ ආදරය කරන දේ උගන්වන්න.",
    tutorAsideHeading2: "ඔබේ සිසු පදනම වර්ධනය කරන්න.",
    tutorAsideDesc:
      "Smart Tuition Finder භාවිතා කරන සිය ගණනක් ශ්‍රී ලාංකේය ගුරුවරුන් සමඟ ඉදිරිපත් වෙන්න.",
    tutorAsideItems: [
      "Demo වීඩියෝ සහිත සත්‍යාපිත ප්‍රොෆයිලය",
      "ළඟ සිසුන් සමඟ smart ගැළපීම",
      "ඉදිරිපත් කළ session කාලසටහන්",
    ],

    // ── Footer ────────────────────────────────────────────────────────────────
    footerDesc:
      "විශ්වාසදායක ගුරුවරුන් සොයා, ප්‍රොෆයිල් සංසන්දනය කර, නිවැරදි ඉගෙනුම් සහාය ඉක්මනින් ලබා ගන්න.",
    footerProductTitle: "නිෂ්පාදිත",
    footerResourcesTitle: "සම්පත්",
    footerOverview: "දළ විශ්ලේෂණය",
    footerFeatures: "විශේෂාංග",
    footerTutors: "ගුරුවරුන්",
    footerJoin: "එකතු වන්න",
    footerStudentLogin: "සිසු පිවිසීම",
    footerTutorLogin: "ගුරු පිවිසීම",
    footerSignUp: "ලියාපදිංචි වන්න",
    footerStayUpdated: "යාවත්කාලීනව සිටින්න",
    footerEmailPlaceholder: "ඔබේ ඊමේල් ලිපිනය ඇතුළු කරන්න",
    footerSubscribe: "Subscribe කරන්න",
    footerAllRightsReserved: "සියලු හිමිකම් ඇවිරිණ.",

    // ── Tutor dashboard ───────────────────────────────────────────────────────
    tutorDashboardLabel: "ගුරු dashboard",
    studentDashboardLabel: "සිසු dashboard",
    welcomeBack: "නැවත සාදරයෙන් පිළිගනිමු",
    loading: "පූරණය වෙමින්…",
    editProfile: "ප්‍රොෆයිලය සංස්කරණය කරන්න",
    publicProfile: "පොදු ප්‍රොෆයිලය",
    proPlan: "Pro සැලැස්ම",
    signOutBtn: "ඉවත් වන්න",
    signingOut: "ඉවත් වෙමින්…",

    activeStudents: "සක්‍රිය සිසුන්",
    sessionsThisWeek: "මෙ සතියේ සැසි",
    averageRating: "සාමාන්‍ය ශ්‍රේණිගත කිරීම",
    payingSubscribers: "ගෙවන subscribers",
    liveMeetingsSub: "සජීවී රැස්වීම්",
    reviews: "සමාලෝචන",
    review: "සමාලෝචනය",

    liveClasses: "සජීවී පන්ති",
    newMeeting: "නව රැස්වීම",
    creating: "සාදමින්…",
    noMeetingsYet: "රැස්වීම් නැත",
    noMeetingsDesc: "ආරම්භ කිරීමට 'නව රැස්වීම' ක්ලික් කරන්න",
    joinRoom: "කාමරයට ඇතුළු වන්න",
    joinClass: "පන්තියට ඇතුළු වන්න",
    join: "ඇතුළු වන්න",

    profileSection: "ප්‍රොෆයිලය",
    nameLabel: "නම",
    emailLabel: "ඊමේල්",
    roleLabel: "භූමිකාව",
    accountLabel: "ගිණුම",
    verifiedTutorRole: "සත්‍යාපිත ගුරුවරයා",
    studentRole: "සිසු",
    quickLinks: "ඉක්මන් සබැඳි",
    manageMeetings: "රැස්වීම් කළමනාකරණය",
    upgradeToPro: "Pro ට උසස් කරන්න",
    viewPublicProfile: "පොදු ප්‍රොෆයිලය බලන්න",

    // ── Student dashboard ─────────────────────────────────────────────────────
    liveMeetingsLabel: "සජීවී රැස්වීම්",
    savedTutorsLabel: "සුරැකි ගුරුවරුන්",
    activeSubscriptions: "සක්‍රිය subscriptions",
    fromSubscribedTutors: "subscribe කළ ගුරුවරුන්ගෙන්",
    onYourList: "ඔබේ ලැයිස්තුවේ",
    tutorChannels: "ගුරු channels",

    noLiveMeetingsYet: "සජීවී රැස්වීම් නැත",
    noLiveDesc1: "ඔවුන්ගේ සජීවී පන්තිවලට ඇතුළු වීමට ගුරුවරයෙකු subscribe කරන්න",
    noLiveDesc2: "ඔබේ ගුරුවරයා තවම රැස්වීමක් ආරම්භ කර නැත",

    messages: "පණිවිඩ",
    noMessagesYet: "පණිවිඩ නැත",
    messageTutorHint: "ඔවුන්ගේ ප්‍රොෆයිල් පිටුවෙන් ගුරුවරයෙකුට පණිවිඩ කරන්න",
    noMessagesStudentHint: "ඔවුන්ගේ ප්‍රොෆයිල් පිටුවෙන් ගුරුවරයෙකුට පණිවිඩ කරන්න",

    savedTutorsTitle: "සුරැකි ගුරුවරුන්",
    browse: "ගවේෂණය කරන්න",
    noSavedTutors:
      "සුරැකි ගුරුවරුන් නැත — ඔවුන් සුරැකීමට ඕනෑම ගුරු ප්‍රොෆයිලයේ heart icon ස්පර්ශ කරන්න.",
    tips: "ඉඟි",
    tipsDesc:
      "විෂය, මට්ටම සහ ස්ථාන ගැළappීමට ගුරු directory හි filters භාවිතා කරන්න. ඔබ කැමති ගුරුවරුන් favourite කරන්න.",

    tutorInvitedYou: "ඔබේ ගුරුවරයා ඔබව ආරාධනා කළේ",
    inviteReceived: "ආරාධනය ලැබුණේ",
    liveNow: "දැන් සජීවීව",
    live: "සජීවී",

    findTutors: "ගුරුවරුන් සොයන්න",

    // ── All Tutors page ───────────────────────────────────────────────────────
    allTutorsHeadline: "ඔබේ ගුරුවරයා සොයන්න",
    allTutorsDesc: "ශ්‍රී ලංකාව පුරා සත්‍යාපිත ගුරුවරුන් ගවේෂණය කරන්න.",
    searchPlaceholder: "නම, විෂය අනුව සොයන්න…",
    clearSearch: "සෙවුම ඉවත් කරන්න",
    allSubjects: "සියලු විෂයයන්",
    subjectBiology: "ජෛව විද්‍යාව",
    subjectICT: "ICT",
    subjectBusiness: "ව්‍යාපාර",
    anyPrice: "ඕනෑම මිලක්",
    anyRating: "ඕනෑම ශ්‍රේණිගත කිරීමක්",
    highestRated: "ඉහළම ශ්‍රේණිගත",
    priceLowToHigh: "මිල: අඩුෙ සිට වැඩිෙ",
    priceHighToLow: "මිල: වැඩිෙ සිට අඩුෙ",
    nameAZ: "නම (A → Z)",
    noTutorsFound: "ඔබේ පෙරහන් සඳහා ගුරුවරුන් හමු නොවිය.",
    tutorsMatchFilters_one: "{count} ගුරුවරයෙකු ඔබේ පෙරහන්ට ගැළපේ",
    tutorsMatchFilters_many: "{count} ගුරුවරුන් ඔබේ පෙරහන්ට ගැළපේ",
    tutorsEmptyHint:
      "මිල පරාසය පුළුල් කරන්න, ශ්‍රේණිගත කිරීම අඩු කරන්න, හෝ වෙනත් විෂයයක් තෝරන්න.",
    resetFilters: "පෙරහන් නැවත සකසන්න",
    viewProfile: "ප්‍රොෆයිලය බලන්න",
    generalSubject: "සාමාන්‍ය",
    featuredBadge: "ප්‍රමුඛ",
    verifiedBadge: "සත්‍යාපිත",
    newTutor: "නව ගුරුවරයා",
    fromLabel: "සිට",
    rateOnProfile: "මිල ප්‍රොෆයිලයේ",
    perHourShort: "/පැ",

    // ── Tutor profile page ───────────────────────────────────────────────────
    loadingTutorProfile: "ගුරු ප්‍රොෆයිලය පූරණය වෙමින්...",
    profileBoostBadge: "ප්‍රොෆයිල බූස්ට්",
    yearsExperienceShort: "{count}+ අවුරුදු අත්දැකීම",
    bookSession: "සැසිය වෙන්කරගන්න",
    messageButton: "පණිවිඩය",
    whatsappButton: "WhatsApp",
    processingEllipsis: "සකස් කරමින්…",
    subscribeLiveClasses: "සජීවී පන්ති සඳහා subscribe කරන්න",
    saved: "සුරැකි",
    saveTutor: "ගුරුවරයා සුරකින්න",

    unavailable: "ලබාගත නොහැක",
    bookNowWithSelection: "දැන් වෙන්කරගන්න · {slot}",
    selectSlotToBook: "වෙන්කරගැනීමට slot එකක් තෝරන්න",

    thanksForReview: "ඔබගේ සමාලෝචනයට ස්තුතියි!",
    leaveReview: "සමාලෝචනයක් දමන්න",
    reviewPlaceholder: "ඔබගේ අත්දැකීම බෙදාගන්න (විකල්ප)…",
    submittingEllipsis: "සමర్పණය කරමින්…",
    submitReview: "සමාලෝචනය යවන්න",

    messageTutorTitle: "{name} ට පණිවිඩයක්",
    messageTutorPlaceholder:
      "හෙයි {name}, මම ඔබගේ ප්‍රොෆයිලය Smart Tuition Finder තුළ දැක්කා…",
    cancel: "අහෝසි කරන්න",
    sendingEllipsis: "යවමින්…",

    tutorNotFoundTag: "404 · ගුරුවරයා හමු නොවිය",
    tutorNotFoundHeadline: "එම ගුරුවරයා සොයාගත නොහැක.",
    tutorNotFoundDesc:
      "ඔබ සොයන ගුරුවරයා ස්ථානය මාරු කර ඇති හෝ Smart Tuition Finder හි සක්‍රීය නොවිය හැක. මුල් පිටුවේ featured ගුරුවරුන් බලන්න.",
    backToHomepage: "මුල් පිටුවට ආපසු",

    signInStudentToSaveTutorsToast: "ගුරුවරුන් සුරැකීමට සිසු ලෙස sign in වන්න.",
    removedFromSavedToast: "සුරැකි ලැයිස්තුවෙන් ඉවත් කළා.",
    tutorSavedToast: "ගුරුවරයා ඔබගේ ලැයිස්තුවට සුරැකිණි!",
    couldNotUpdateSavedToast: "සුරැකි තත්වය යාවත්කාලීන කළ නොහැක.",
    sessionBookedForToast: "{slot} සඳහා සැසිය වෙන්කරගත්තා 🎉",
    selectSlotBelowToast: "කරුණාකර පහතින් slot එකක් තෝරන්න.",
    whatsAppNumberNotAvailableToast:
      "මෙම ගුරුවරයා සඳහා WhatsApp අංකය නොමැත.",
    signInStudentToSubscribeToast: "subscribe කිරීමට සිසු ලෙස sign in වන්න.",
    paymentReceivedToast:
      "ගෙවීම ලැබුණා. ආරක්ෂිත තහවුරුවෙන් පසු subscription සක්‍රීය වේ.",
    subscriptionCancelledToast: "Subscription ගෙවීම අවලංගු කළා.",
    paymentFailedToast: "ගෙවීම අසාර්ථකයි: {error}",
    couldNotStartSubscriptionToast: "Subscription checkout ආරම්භ කළ නොහැක.",
    signInStudentToMessageTutorToast:
      "මෙම ගුරුවරයාට පණිවිඩ කිරීමට සිසු ලෙස sign in වන්න.",
    messageSentToast: "පණිවිඩය යවා ඇත!",

    shareTutorProfileText: "Smart Tuition Finder හි {name} බලන්න",
    whatsAppIntroMessage:
      "හෙයි {name}, මම ඔබගේ ප්‍රොෆයිලය Smart Tuition Finder තුළින් හමු වුණා.",

    profileAboutTitle: "ගුරුවරයා ගැන",
    profileAboutEmpty: "මෙම ගුරුවරයා ගැන කොටස තවම එක් කර නැත.",
    qualificationsTitle: "සුදුසුකම් සහ අත්දැකීම්",
    qualificationsEmpty: "සුදුසුකම් හෝ අත්දැකීම් විස්තර තවම එක් කර නැත.",
    subjectsGradesTitle: "විෂයයන් සහ ශ්‍රේණි",
    subjectsGradesEmpty: "විෂයයන් හෝ ශ්‍රේණි තවම එක් කර නැත.",
    subjectGeneric: "විෂයය",
    demoVideosTitle: "Demo වීඩියෝ",
    videosCount: "{count} වීඩියෝ",
    demoVideosEmpty: "Demo වීඩියෝ තවම එකතු කර නැත.",
    studentReviewsTitle: "සිසු සමාලෝචන",
    noReviewsYet: "සමාලෝචන නැත. පළමුවෙන්ම එකක් දමන්න!",
    anonymous: "නම නොදන්නා",
    availabilityBookingTitle: "ලබාගත හැකි වේලාවන් සහ වෙන්කරගැනීම",
    availabilityNotAddedEmpty: "ලබාගත හැකි වේලාවන් තවම එක් කර නැත.",

    // ── Form validation & auth ─────────────────────────────────────────────────
    fullNamePlaceholder: "උදා: Priya Wickramasinghe",
    pleaseEnterFullName: "කරුණාකර සම්පූර්ණ නම ඇතුළු කරන්න.",
    emailAddressLabel: "විද්‍යුත් ලිපිනය",
    passwordLabel: "මුරපදය",
    confirmPasswordLabel: "මුරපදය තහවුරු කරන්න",
    confirmPassword: "ඔබේ මුරපදය නැවත ඇතුළු කරන්න",
    passwordAtLeast8: "අවම වශයෙන් අක්ෂර 8",
    passwordStrengthHint: "අක්ෂර 8+ භාවිතා කරන්න අක්ෂර සහ සංඛ්‍යා සමඟ.",
    passwordsNotMatch: "මුරපදයන් ගැළපෙන්නේ නැත.",
    agreeToTerms: "මම Terms සහ Privacy Policy වලට එකඟ වෙමි",
    acceptTermsRequired: "කරුණාකර Terms සහ Privacy Policy ընդունා ගන්න.",
    createAccount: "ගිණුම සාදන්න",
    createStudentAccountBtn: "සිසු ගිණුම සාදන්න",
    createTutorAccountBtn: "ගුරු ගිණුම සාදන්න",

    // ── Signup page ────────────────────────────────────────────────────────────
    studentsAndTutorsStartHere: "සිසුන් සහ ගුරුවරුන් මෙතැන සිට ආරම්භ කරයි.",
    signupAsideDesc: "එක ස්ථානයක් නිබඩ ගිණුමක් සාදන්න. ඔබ ඉදිරිපත් කිරීමට පෙර ඕනෑම අවස්ථාවේ සිසු සහ ගුරු ලියාපදිංචි හරහා ස්විච් කරන්න.",
    roleSpecificDashboards: "ඇතුළු වීමෙන් පසු භූමිකා-විශේෂිත dashboards",
    secureEmailSignup: "ඉරණම්කාර විද්‍යුත් ලිපිනය සහ මුරපදය ලියාපදිංචිය",
    builtForSriLanka: "ශ්‍රී ලංකාවේ ඉගෙනන්නන් සහ අධිකාරීන්ට ගොඩ නඟන ලදි",
    chooseStudentOrTutor: "සිසුවෙකු හෝ ගුරුවරයා තෝරා, පසුව ඇඳුම පූරණය කරන්න.",

    // ── Student register ───────────────────────────────────────────────────────
    findPerfectTutorMinutes: "මිනිත්තු කිහිපයකින් ඔබේ පරිපූර්ණ ගුරුවරයා සොයා ගන්න.",
    studentRegisterAside: "ශ්‍රී ලංකාවේ ගුරුවරුන් සෙවීමට, සුරැකීමට සහ ඔබට ආසන්න සඳහා නිබඩ ගිණුමක් සාදන්න.",
    discoverVerifiedTutors: "ශ්‍රී ලංකාව පුරා සත්‍යාපිත ගුරුවරුන් සොයා ගන්න",
    filterBySubjectGrade: "විෂය, ශ්‍රේණිය, ස්ථාන සහ අයවැයෙන් පෙරණය කරන්න",
    saveFavouriteTutors: "ප්‍රිය ගුරුවරුන් සුරැකි ගෙන සහාය සඳහා පණිවිඩ කරන්න",
    trackLearningJourney: "එක ස්ථානයෙන් ඔබේ ඉගෙනුම් ගමන ලුහුබඳින්න",
    displayNameLabel: "ප්‍රදර්ශන නම",
    bioLabel: "ජීවනක",
    addShortBio: "ගුරුවරුන්ට ඔබේ ඉගෙනුම් ඉලක්ක තේරුම් ගැනීමට ඉතා කෙටි ජීවනක එක් කරන්න.",
    bioPlaceholder: "ඔබේ මට්ටම, ඉලක්ක සහ ගුරුවරයෙකුගෙන් ඔබ අපේක්ෂා කරන දේ ගැන පේළි කිහිපයක්.",
    charactersRemaining: "/600 අක්ෂර",

    // ── Student profile edit ───────────────────────────────────────────────────
    yourStudentProfile: "ඔබේ සිසු ප්‍රොෆයිලය",
    keepProfileUpToDate: "ඔබේ ප්‍රොෆයිලය යාවත්කාලීනව ගබඩා කරන්න",
    profileHelpText: "ඔබේ නම සහ ජීවනක ගුරුවරුන්ට ඔබව හඳුනා ගැනීමට උපකාරී වේ. වෙනස්කම් ස්වයංක්‍රීයව සුරැකිය.",
    profileBasics: "ප්‍රොෆයිල මූලික",
    profileBasicsDesc: "ගුරුවරුන් ඔබ සම්බන්ධ කරන විට නම සහ කෙටි ජීවනක බලයි.",
    loadingProfile: "ඔබේ ප්‍රොෆයිලය පූරණය වෙමින්…",
    backToDashboard: "Dashboard දෙසට ඇතුළු වන්න",

    // ── Tutor register ────────────────────────────────────────────────────────
    tutorRegisterAside: "ඔබ ආදරය කරන දේ උගන්වන්න. ඔබේ සිසු පදනම වර්ධනය කරන්න.",

    // ── Tutor profile edit ─────────────────────────────────────────────────────
    editTutorProfile: "ගුරු ප්‍රොෆයිලය සංස්කරණය කරන්න",
    yourTutorProfile: "ඔබේ ගුරු ප්‍රොෆයිලය",

    // ── Tutor own profile ──────────────────────────────────────────────────────
    loadingProfileEllipsis: "ඔබේ ප්‍රොෆයිලය පූරණය වෙමින්...",

    // ── Tutor Pro plan ────────────────────────────────────────────────────────
    proPlusTitle: "Pro Plus",
    proMaxTitle: "Pro Max",
    growthPlanForTutors: "ක්‍රියාකාරී ගුරුවරුන් සඳහා වර්ධන සැලැස්ම",
    maximumVisibilityForTutors: "බරපතල ගුරුවරුන් සඳහා උපරිම දෘශ්‍යමানતාව",
    profileBoostInSearch: "ගුරු සෙවුමේ ප්‍රොෆයිල බූස්ටර්",
    verifiedBlueMark: "ගුරු කාඩ් සහ ප්‍රොෆයිලයේ සත්‍යාපිත නිල් ලකුණු",
    priorityPlacement: "විෂය ප්‍රවර්ගවල অগ්‍රාধිකාර ස්ථාපනය",
    basicProAnalytics: "මූලික Pro විශ්ලේෂණ dashboard",
    everythingInProPlus: "Pro Plus එ සියල්ල",
    strongerBoostInLists: "ලැයිස්තු සහ ප්‍රමුඛ පේළිවල ශක්තිමත් බූස්ටර්",
    prioritySupportResponse: "ප්‍රාග්‍රමණ සහාය ප්‍රතිචාරය",
    advancedLeadInsights: "උසස් ඉතුරුව අර්ථය සහ පරිවර්තන ප්‍රවණතා",
    payWithPayHere: "PayHere සමඟ ගෙවන්න",
    paymentSuccessful: "ගෙවීම සාර්ථකයි",
    paymentCompletedDbFailed: "ගෙවීම අවසර දුන් නමුත් දත්තගබඩා යාවත්කාලීනතා අසාර්ථක",
    paymentCancelled: "ගෙවීම අවලංගු කරන ලදි.",
    paymentError: "PayHere දෝෂය",
    proStatusActivated: "සත්‍යාපිත නිල් ලකුණු සහ ප්‍රොෆයිල බූස්ටර් දැන් සක්‍රියයි.",

    // ── Payment status page ────────────────────────────────────────────────────
    paymentFailed: "ගෙවීම අසාර්ථක වූ හෝ අවලංගු කරන ලදි",
    subscriptionActivationSoon: "ඔබේ ගෙවීම ලැබුණි. Subscription සක්‍රීයතාවය ඉතා ඉක්මනින් තහවුරු කෙරේවි.",
    proStatusUpdateSoon: "ඔබේ ගෙවීම ලැබුණි. ඔබේ Pro තත්ත්ව යාවත්කාලීනතාවය ඉතා ඉක්මනින් තහවුරු කෙරේවි.",
    paymentNotCompleted: "ඔබේ ගෙවීම සම්පූර්ණ කර නොමැත. කරුණාකර නැවත උත්සාහ කරන්න.",
    backToTutorProfiles: "ගුරු ප්‍රොෆයිල දෙසට ඇතුළු වන්න",
    backToProPlans: "Pro සැලැස්ම දෙසට ඇතුළු වන්න",
    goToDashboard: "Dashboard ට යන්න",

    // ── Tutor profile ─────────────────────────────────────────────────────────
    noDetailsAddedYet: "තවමත් විස්තර එක් කර නොමැත.",
    ratePerhour: "/ පැයට",
    rateNotSet: "අනුපාතය සකසා නැත",
    removeBookmark: "පිටපතිය ඉවත් කරන්න",
    saveTutorBookmarks: "මෙම ගුරුවරයා පිටපතිවලට සුරැකින්න",
    reviewsCount: "සමාලෝචන",

    // ── Live join page ────────────────────────────────────────────────────────
    loadingMeeting: "රැස්වීම පූරණය වෙමින්...",
    meetingNotFound: "රැස්වීම හමු නොවිය.",
    meetingPasscode: "රැස්වීම් මුරපදය (අවශ්‍ය නම්)",
    enterPasscode: "මුරපදය ඇතුළු කරන්න",

    // ── Tutor live meeting ─────────────────────────────────────────────────────
    loadingRoom: "කාමරය පූරණය වෙමින්…",
    meetingNotFoundHost: "රැස්වීම හමු නොවිය හෝ ඔබ ගෙවිසරුවා නොවිසි.",
    copied: "පිටපත්",
    copyInvite: "ආරාධනය පිටපත් කරන්න",
    passcode: "මුරපදය",
    goLive: "සජීවීව යන්න",
    meetingEnded: "රැස්වීම අවසර දුණි",
    sessionFinished: "මෙම සැසිය අවසර විය.",
    scheduled: "සකසා ඇත",
    ended: "අවසර විය",
    setPasscodeOptional: "මුරපදය සකසන්න (ඉවත් කිරීමට හිස් ඇතිරු කරන්න)",
    save: "සුරැකින්න",
    setPasscodePlaceholder: "උදා: 123456",

    // ── Tutor live host ───────────────────────────────────────────────────────
    hostLiveClasses: "සජීවී පන්තිවල ගෙවිසරු වන්න",
    createRunLiveLessons: "Smart Tuition Finder තුළ සජීවී පාඩම් සාදි ධාවනය කරන්න.",
    checkingProAccess: "ඔබේ Pro ප්‍රවේශය පිරික්සනු ලෙස...",
    tutorProRequired: "සජීවී පන්තිවල ගෙවිසරු කිරීමට ගුරු Pro අවශ්‍යයි.",
    upgradeNow: "දැන් උසස් කරන්න",
    createMeeting: "රැස්වීම සාදන්න",
    meetingTitle: "මාතෘකාව",
    meetingDescription: "විස්තරණය",
    meetingPasscodeOptional: "රැස්වීම් මුරපදය (විකල්පිතව)",
    enableWaitingRoom: "බලා සිටින කාමරය සබල කරන්න",
    startsAt: "ඉතිරි බිම්පත:",
    endsAt: "ඉතිරි ගෙවෙයි:",

    // ── Live chat panel ───────────────────────────────────────────────────────
    liveChat: "සජීවී සංවාදය",
    askQuestionInClass: "සජීවී පන්තියේ ප්‍රශ්නයක් අසන්න...",
    sendMessage: "පණිවිඩය යවන්න",

    // ── Polls & QA panel ───────────────────────────────────────────────────────
    polls: "ඡන්ද",
    pollQuestion: "ඡන්ද ප්‍රශ්නය",
    oneOptionPerLine: "එක් ගිණුම පේළියකට",
    createPoll: "ඡන්දය සාදන්න",
    closePoll: "ඡන්දය වසන්න",
    qa: "ප්‍ර.අ.",
    askQuestion: "ප්‍රශ්නයක් අසන්න...",
    ask: "අසන්න",
    answered: "පිළිතුරු දුන් ලදි",
    markAnswered: "පිළිතුරු දුන් ලෙස ලකුණු කරන්න",

    // ── Raise hand panel ───────────────────────────────────────────────────────
    raiseHand: "අතක උස්සාගන්න",
    lowerHand: "අත පහත නෙලන්න",
    you: "ඔබ",
    raised: "උස්සාගත්",
    idle: "නිෂ්ක්‍රිය",

    // ── Participant grid ───────────────────────────────────────────────────────
    guest: "අමතුගේ",
    screen: "තිරය",

    // ── FAQ ────────────────────────────────────────────────────────────────────
    frequentlyAskedQuestions: "නිතර අසන ප්‍රශ්න",
    faqSubtitle: "ගුරුවරුන් සොයා ගැනීම, ලියාපදිංචි කිරීම, ප්‍රොෆයිල සහ Smart Tuition Finder භාවිතා කිරීම පිළිබඳ ඉක්මන් පිළිතුරු.",
    howFindRightTutor: "නිවැරදි ගුරුවරයා සොයා ගන්නේ කෙසේද?",
    howFindRightTutorAns: "විෂය, මට්ටම සහ ස්ථාන අනුසරණයෙන් සෙවීමට උසස්තර පෙරණයන් භාවිතා කරන්න. ගුරු ප්‍රොෆයිල සහ සමාලෝචන කියවා සුදුසුකම් සහ ඉගැන්වීම් විලාශය සංසන්දනය කරන්න.",
    areTutorProfilesVerified: "ගුරු ප්‍රොෆයිල සත්‍යාපිතයි ද?",
    areTutorProfilesVerifiedAns: "ඔව්, Smart Tuition Finder හි සියලු ගුරුවරුන් සත්‍යාපිතිකරණ ක්‍රියාවලිය හරහා යান. ඔවුන්ගේ ප්‍රොෆයිලයේ සත්‍යාපිත ලාකුණ බලන්න.",
    howLongRegistration: "ලියාපදිංචිය කොපමණ කාලයක් ගතවේද?",
    howLongRegistrationAns: "ලියාපදිංචිය මිනිත්තු 2-3 ගතවේ. ඔබේ විස්තර ඇතුළු කරන්න, මුරපදයක් සාදන්න, සහ ඔබ ගුරුවරුන් ගවේෂණය කිරීම අවිරතව ආරම්භ කරන්න.",
    canTutorsEditProfile: "ගුරුවරුන්ට පසුව ප්‍රොෆයිලය සංස්කරණය කළ හැකිද?",
    canTutorsEditProfileAns: "ඔව්, ගුරුවරුන්ට ඔවුන්ගේ ප්‍රොෆයිල තොරතුරු, අනුපාතිකතා, ලබ්ධතාවය සහ ප්‍රොෆයිල පින්තුරය ඕනෑම විටින් යාවත්කාලීනය කළ හැක ඔවුන්ගේ dashboard එක සිට.",
    canStudentsSaveTutors: "ගිණුමින් තොරතුරු ගුරුවරුන් ගබඩා කිරීමට හෝ සංසන්දනය කළ හැකිද?",
    canStudentsSaveTutorsAns: "නිසැකවම! සිසුන්ට ඔවුන්ගේ ප්‍රිය ගුරුවරුන්ට සුරැකිය හැක සහ තීරණ ගැනීමට පෙර බහු ප්‍රොෆයිල සංසන්දනය කරන්න.",
    howStudentsContactTutors: "ගිණුමින් ගුරුවරුන් සම්බන්ධ කරනු ලබයි ද?",
    howStudentsContactTutorsAns: "සිසුන්ට ඔවුන්ගේ ප්‍රොෆයිල පිටුවෙන් ගුරුවරුන්ට සෘජු පණිවිඩ යැවිය හැක. ගුරුවරුන් සාමාන්‍යයෙන් පැයක් තුළ ප්‍රතිචාර දෙයි.",
    whatSubjectsSupported: "සහාය දක්වන විෂයයන් මොනවාද?",
    whatSubjectsSupportedAns: "අපි ගණිතය, විද්‍යාව, ඉංග්‍රීසි, ඉතිහාසය, කලාව, භෞතික විද්‍යාව, ජීව විද්‍යාව, ICT සහ බොහෝ අනෙකුත් විෂයයන් සියලු මට්ටමින් සහාය දෙමු.",
    isThereFee: "Platform භාවිතා කිරීමට ගෙවිය යුතු වීමක් තිබේවා?",
    isThereFeAns: "ගිණුම සාදිම සහ ගුරුවරුන් ගවේෂණය සම්පූර්ණයෙන්ම නිෂ්ක්‍රියයි. සමහර ගුරුවරුන් premium ලක්ෂණ හෝ subscription-පදනම් සැසි ඉදිරිපත් කරයි.",
    whoCanJoinAsTutor: "ගුරුවරයා ලෙස සම්බන්ධ විය හැකි කවුද?",
    whoCanJoinAsTutorAns: "ඕනෑම සුදුසු අධිකාරී හෝ අත්දැකීම් සහිත ගුරුවරයා සම්බන්ධ විය හැක. අපි සියලු භාවිතාකරුවරුන්ට ගුණාත්මතාවය සහ ආරක්ෂාවක් සහතික කිරීම සඳහා ප්‍රොෆයිල සමාලෝචනය කරමු.",

    // ── Supabase setup notice ──────────────────────────────────────────────────
    supabaseNotConfigured: "Supabase සකසා නැත",
    supabaseSetupInstructions: "`.env.local` වෙත Supabase URL සහ anon key එක් කරන්න (`.env.example` බලන්න), පසුව SQL සංස්කරණය තුළ `supabase/schema.sql` ධාවනය කරන්න ලියාපදිංචි සහ ඇතුළු කිරීම සබල කිරීමට.",
    supabaseIsntConfigured: "Supabase සකසා නැත",
    addSupabaseUrl: "Supabase URL සහ key `.env.local` වෙත එක් කරන්න සහ dev සර්වරය නැවත ආරම්භ කරන්න.",

    // ── Auth layout aside ──────────────────────────────────────────────────────
    teachWhatYouLove: "ඔබ ආදරය කරන දේ උගන්වන්න.",
    growYourStudentBase: "ඔබේ සිසු පදනම වර්ධනය කරන්න.",
    tutorLayoutAside: "Smart Tuition Finder ඉතිමේ භාවිතා කරන ශ්‍රී ලාංකේය ගුරුවරුන්ගේ ගිණුම සම්බන්ධ වෙන්න ඔවුන්ගේ අවස්ථාවන් පුරවිය සහ පිපුනු ගිණුමින් සොයා ගැනීම සඳහා.",
    verifiedProfileVideos: "Demo වීඩියෝ සහිත සත්‍යාපිත ප්‍රොෆයිලය",
    smartMatchingStudents: "ඉතාසමීපවර්තී ගිණුමින් සමඟ smart ගැළපීම",
    builtInSessionScheduling: "ඉතිරි session එ කාලසටහන්කරණය",

    // ── Form field ─────────────────────────────────────────────────────────────
    showPasswordBtn: "මුරපදය පෙන්වන්න",
    hidePasswordBtn: "මුරපදය සඟවන්න",

    // ── Gemini chatbot ────────────────────────────────────────────────────────
    messageCouldntProcess: "එම පණිවිඩය සැකසිය නොහැකි විය. විවිධ වචනවලින් අසන්න.",
    replyFiltered: "පිළිතුර පෙරණය කරන ලදි. කෙටි හෝ වඩා සාමාන්‍ය ප්‍රශ්නයක් උත්සාහ කරන්න.",
    noReplyText: "කිසිදු පිළිතුර පෙළ ආපසු ආවේ නැත. වෙනත් ආකෘතිය වැඩ කිරීමට පුළුවන්ය.",
    assistantNotConfigured: "සහාය ඔබ දේ සකසා නැත. VITE_GEMINI_API_KEY `.env.local` එකට එක් කරන්න, dev සර්වරය නැවත ආරම්භ කරන්න, පසුව නැවතත් උත්සාහ කරන්න.",
    googleFreeQuotaExceeded: "මෙම API සඳහා Google හි නිෂ්ක්‍රිය කෝටා අධිකරණය විය. ඉදිරියට ගිය ගිණුම Cloud එකට එක් කරන්න.",

    // ── Site header ────────────────────────────────────────────────────────────
    smartTuitionFinder: "Smart Tuition Finder",
    findLearnGrow: "සොයා ගන්න · ඉගෙන ගන්න · වර්ධනය වන්න",
    courses: "පාඨමාලා",
    dashboard: "Dashboard",

    // ── Tutor directory filters ────────────────────────────────────────────────
    tutorDirectory: "ගුරු සංකෙතන",
    findYourNextTutor: "ඔබේ ඉදිරි ගුරුවරයා සොයා ගන්න.",
    searchByNameSubject: "නම, විෂය හෝ නගරයෙන් සොයා, පසුව සරල පෙරණයෙන් ලැයිස්තුව පිරිසිදු කරන්න.",
    underLKR3000: "LKR 3000 ට අඩුයි",
    lkr3000To4500: "LKR 3 000 – 4 500",
    overLKR4500: "LKR 4500 ට වැඩිය",
    rating4Point5: "4.5+",
    rating4Point8: "4.8+",
    rating5: "5.0",
  },

  // ════════════════════════════════════════════════════════════════════════════
  ta: {
    // ── Navbar ────────────────────────────────────────────────────────────────
    signUp: "பதிவு செய்யுங்கள்",
    signOut: "வெளியேறு",
    toggleTheme: "தீம் மாற்று",
    navHome: "முகப்பு",
    navFeatures: "அம்சங்கள்",
    navTutors: "ஆசிரியர்கள்",
    navReviews: "மதிப்புரைகள்",
    navJoin: "சேருங்கள்",

    // ── Home page ─────────────────────────────────────────────────────────────
    heroTag: "Smart ஆசிரியர் தளம்",
    heroHeadline: "ஒரே இடத்தில் ட்யூஷனை கண்டுபிடித்து நிர்வகிக்கவும்.",
    heroSubtitle:
      "Smart Tuition Finder மாணவர்களுக்கும் பெற்றோர்களுக்கும் சரிபார்க்கப்பட்ட ஆசிரியர்களை ஒப்பிட, விஷயம் மற்றும் இடம் அனுசரித்து வடிகட்ட, dashboard இல் இருந்து நேரடியாக தொடர்பு கொள்ள உதவுகிறது.",
    getStarted: "தொடங்கு",
    seeHowItWorks: "எப்படி வேலை செய்கிறது என்று பார்க்கவும்",
    learnMore: "மேலும் அறிக",
    verifiedTutors: "சரிபார்க்கப்பட்ட ஆசிரியர்கள்",
    studentInquiries: "மாணவர் விசாரணைகள்",
    avgRating: "சராசரி மதிப்பீடு",

    heroHeadline2: "கல்வி. எளிமைப்படுத்தப்பட்டது.",
    heroSubtitle2:
      "ஆசிரியர்களை கண்டுபிடிக்க, சுயவிவரங்களை ஒப்பிட, சரியான கற்றல் ஆதரவை குழப்பமின்றி தேர்வு செய்வதற்கான அமைதியான, நவீன வழி.",

    builtForEveryStage: "ஒவ்வொரு கற்றல் நிலைக்கும்",
    levelSchool: "பள்ளி",
    levelAL: "A/L",
    levelUniversity: "பல்கலைக்கழகம்",
    levelProfessional: "தொழில்முறை திறன்கள்",

    searchLabel: "தேடு",
    matchByHeadline: "முக்கியமானதால் பொருந்துங்கள்.",
    subjectLabel: "பாடம்",
    areaLabel: "பகுதி",
    levelLabel: "நிலை",
    recommendedMatch: "பரிந்துரைக்கப்பட்ட பொருத்தம்",
    tutorShortlist: "ஆசிரியர் குறுகிய பட்டியல்",
    cleanProfilesHeadline: "சுத்தமான சுயவிவரங்கள். தெளிவான தேர்வுகள்.",
    nearbyCount: "அருகில் {count}",

    exploreSubjectsTag: "பாடங்களை ஆராயுங்கள்",
    popularSubjectsHeadline: "ஒவ்வொரு பாடமும் எளிதாக கண்டுபிடிக்க முடிகிறது.",
    popularSubjectsDesc:
      "சுத்தமான பாட அட்டைகள் தேடலை கவனமாக, படிக்கக்கூடியதாக மற்றும் முதல் கிளிக்கிலிருந்தே வேகமாக வைத்திருக்கின்றன.",

    featuredTutorsTag: "சிறப்பு ஆசிரியர்கள்",
    featuredTutorsHeadline: "போதுமான விவரங்களுடன் சுயவிவரங்கள்.",
    viewAllTutors: "அனைத்து ஆசிரியர்களையும் பார்க்கவும் →",
    noFeaturedTutors: "சிறப்பு ஆசிரியர் சுயவிவரங்கள் இல்லை.",

    howItWorksTag: "எப்படி வேலை செய்கிறது",
    howItWorksHeadline: "ட்யூஷன் தேர்வு செய்வதற்கான சுத்தமான வழி",

    yearsExperience: "கற்றல் அனுபவ ஆண்டுகள்",
    studentsEnrolled: "சேர்ந்த மாணவர்கள்",
    experiencedTeachers: "அனுபவமிக்க ஆசிரியர்கள்",

    designedForFocusTag: "கவனத்திற்காக வடிவமைக்கப்பட்டது",
    designedForFocusHeadline: "எல்லாமே அமைதியாக, தெளிவாக, நோக்கத்துடன் உணர்கிறது.",

    joinPlatformTag: "தளத்தில் சேருங்கள்",
    joinPlatformHeadline: "கற்பவர்களுக்கும் ஆசிரியர்களுக்கும் ஒரே இடம்",
    joinPlatformDesc:
      "சரியான ஆசிரியரை கண்டுபிடிக்க மாணவராக அல்லது வலுவான கற்பித்தல் சுயவிவரம் உருவாக்க ஆசிரியராக பதிவு செய்யுங்கள்.",
    forStudents: "மாணவர்களுக்கு",
    forTutors: "ஆசிரியர்களுக்கு",
    studentFindDesc: "பாடம், இடம் மற்றும் நிலை அனுசரித்து ஆசிரியர்களை எளிதாக கண்டுபிடியுங்கள்.",
    tutorCreateDesc: "உங்கள் சுயவிவரத்தை உருவாக்கி தரமான மாணவர்களுடன் விரைவாக தொடர்பு கொள்ளுங்கள்.",
    studentSignUp: "மாணவர் பதிவு",
    tutorSignUp: "ஆசிரியர் பதிவு",

    studentFindTitle: "உங்கள் இலக்குகளுக்கு ஏற்ற ஆசிரியரை கண்டுபிடியுங்கள்.",
    studentFindLongDesc:
      "பாட பொருத்தம், இடம், மதிப்பீடுகள் மற்றும் கற்பித்தல் பாணியை சுத்தமான அனுபவத்தில் ஒப்பிடுங்கள்.",
    tutorPresentTitle: "உங்கள் கற்பித்தலை அழகாக சமர்ப்பியுங்கள்.",
    tutorPresentDesc:
      "மாணவர்கள் உங்கள் பலங்களை ஒரே பார்வையில் புரிந்துகொள்ள உதவும் சுயவிவரம் உருவாக்குங்கள்.",

    ctaHeadline: "இன்றே சிறந்த கற்றல் விளைவுகளை உருவாக்குங்கள்",
    ctaDesc:
      "Smart Tuition Finder மாணவர்கள், பெற்றோர்கள் மற்றும் ஆசிரியர்களை அமைதியான, நவீன தளம் மூலம் ஒன்றிணைக்கிறது.",
    ctaHeadline2: "நீங்கள் தயாரான போது.",
    ctaDesc2:
      "ஆசிரியர்களை கண்டுபிடிக்கும் சுத்தமான வழியில் தொடங்கி சிறந்த கற்றல் விளைவுகளை கட்டியெழுப்புங்கள்.",
    joinSmartTuition: "Smart Tuition Finder இல் சேருங்கள்",

    // ── Platform steps ────────────────────────────────────────────────────────
    step1Title: "இலக்கைக் கூறுங்கள்",
    step1Desc: "உங்களுக்கு பொருந்தும் பாடம், நிலை, நகரம் மற்றும் கற்றல் பாணியை தேர்ந்தெடுங்கள்.",
    step2Title: "நம்பகமான ஆசிரியர்களை ஒப்பிடுங்கள்",
    step2Desc: "சரிபார்க்கப்பட்ட சுயவிவரங்கள், மதிப்பீடுகள், இடங்கள் மற்றும் சிறப்புகளை நிமிடங்களில் ஆய்வு செய்யுங்கள்.",
    step3Title: "நம்பிக்கையுடன் தொடங்குங்கள்",
    step3Desc: "விரைவாக தொடர்பு கொண்டு சரியான கற்றல் ஆதரவுடன் வேகத்தை பராமரியுங்கள்.",

    // ── Highlights ────────────────────────────────────────────────────────────
    highlight1Title: "சரிபார்க்கப்பட்ட ஆசிரியர் சுயவிவரங்கள்",
    highlight1Desc: "தகுதிகள், அனுபவம் மற்றும் கற்பித்தல் பாணியை ஒரே இடத்தில் பார்க்கவும்.",
    highlight2Title: "Smart உள்ளூர் தேடல்",
    highlight2Desc: "விரைவான பதிவுக்காக நகரம் மற்றும் அருகிலுள்ள பகுதி அனுசரித்து ஆசிரியர்களை கண்டுபிடியுங்கள்.",
    highlight3Title: "விரைவான தொடர்பு",
    highlight3Desc: "தள சுமை இல்லாமல் நேரடி விசாரணைகள் அனுப்பி பதில்களை பெறுங்கள்.",

    // ── Subjects ──────────────────────────────────────────────────────────────
    subjectMaths: "கணிதம்",
    subjectMathsBlurb: "இயற்கணிதம், நுண்கணிதம், புள்ளியியல் மற்றும் போட்டி தயாரிப்பு.",
    subjectScience: "அறிவியல்",
    subjectScienceBlurb: "உயிரியல், வேதியியல் மற்றும் ஆய்வக சோதனைகள்.",
    subjectHistory: "வரலாறு",
    subjectHistoryBlurb: "இலங்கை, உலக வரலாறு மற்றும் விமர்சன பகுப்பாய்வு.",
    subjectArt: "கலை",
    subjectArtBlurb: "வரைதல், ஓவியம், வடிவமைப்பு மற்றும் portfolio உருவாக்கம்.",
    subjectEnglish: "ஆங்கிலம்",
    subjectEnglishBlurb: "இலக்கணம், இலக்கியம், IELTS மற்றும் பேச்சு தேர்ச்சி.",
    subjectPhysics: "இயற்பியல்",
    subjectPhysicsBlurb: "இயக்கவியல், மின்காந்தவியல் மற்றும் A/L தேர்ச்சி.",

    // ── Join modal ────────────────────────────────────────────────────────────
    joinUs: "எங்களுடன் சேருங்கள்",
    createAccountPrompt: "உங்கள் Smart Tuition Finder கணக்கை உருவாக்குங்கள்",
    fullName: "முழு பெயர்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    iAmJoiningAs: "நான் சேருவது",
    student: "மாணவர்",
    tutor: "ஆசிரியர்",
    signUpBtn: "பதிவு செய்யுங்கள்",
    signingUp: "பதிவு செய்கிறோம்...",
    registrationSuccessful: "பதிவு வெற்றிகரமானது!",
    welcomeToStf: "Smart Tuition Finder க்கு வரவேற்கிறோம்.",

    // ── Login pages ───────────────────────────────────────────────────────────
    studentLoginTitle: "மீண்டும் வருக",
    studentLoginSubtitle:
      "ஆசிரியர்களை உலாவ மற்றும் உங்கள் கற்றலை கண்காணிக்க மாணவர் கணக்கில் உள்நுழையுங்கள்.",
    tutorLoginTitle: "மீண்டும் வருக",
    tutorLoginSubtitle:
      "வகுப்புகள், மாணவர்கள் மற்றும் சுயவிவரத்தை நிர்வகிக்க ஆசிரியர் dashboard ல் உள்நுழையுங்கள்.",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடுங்கள்",
    showPassword: "கடவுச்சொல்லை காட்டு",
    hidePassword: "கடவுச்சொல்லை மறை",
    emailRequired: "மின்னஞ்சல் தேவை.",
    emailInvalid: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.",
    passwordRequired: "கடவுச்சொல் தேவை.",
    continueWithEmail: "மின்னஞ்சலுடன் தொடரவும்",
    signingIn: "உள்நுழைகிறோம்...",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    accountCreated:
      "கணக்கு உருவாக்கப்பட்டது. கீழே மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடுங்கள்.",
    noAccount: "கணக்கு இல்லையா?",
    createStudentAccount: "மாணவர் கணக்கை உருவாக்கு",
    areYouTutor: "நீங்கள் ஒரு ஆசிரியரா?",
    tutorSignIn: "ஆசிரியர் உள்நுழைவு",
    dontHaveAccount: "கணக்கு இல்லையா?",
    createTutorAccount: "ஆசிரியர் கணக்கை உருவாக்கு",
    lookingForTutor: "மாணவராக ஆசிரியரை தேடுகிறீர்களா?",
    studentSignIn: "மாணவர் உள்நுழைவு",
    invalidCredentials: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.",
    tooManyAttempts:
      "அதிக முயற்சிகள். சிறிது நேரம் காத்து மீண்டும் முயற்சிக்கவும்.",
    somethingWentWrong: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    studentAsideTitle: "சில நிமிடங்களில் சரியான ஆசிரியரை கண்டுபிடியுங்கள்.",
    studentAsideDesc:
      "சரிபார்க்கப்பட்ட ஆசிரியர்களை உலாவ, பிடித்தவர்களை சேமிக்க மற்றும் ஒரே இடத்தில் கற்றலை நிர்வகிக்க உள்நுழையுங்கள்.",
    studentAsideItems: [
      "இலங்கை முழுவதும் ஆசிரியர்களை உலாவுங்கள்",
      "ஆசிரியர்களுடன் தொடர்பு கொண்டு முன்னேற்றத்தை கண்காணியுங்கள்",
      "உள்நுழைந்த பிறகு மாணவர் dashboard",
    ],
    tutorAsideHeading1: "நீங்கள் விரும்புவதை கற்பியுங்கள்.",
    tutorAsideHeading2: "மாணவர் தளத்தை வளர்த்துக்கொள்ளுங்கள்.",
    tutorAsideDesc:
      "Smart Tuition Finder ஐ ஏற்கனவே பயன்படுத்தும் நூற்றுக்கணக்கான இலங்கை ஆசிரியர்களுடன் இணையுங்கள்.",
    tutorAsideItems: [
      "டெமோ வீடியோக்களுடன் சரிபார்க்கப்பட்ட சுயவிவரம்",
      "அருகிலுள்ட மாணவர்களுடன் smart பொருத்தம்",
      "உள்ளமைக்கப்பட்ட வகுப்பு திட்டமிடல்",
    ],

    // ── Footer ────────────────────────────────────────────────────────────────
    footerDesc:
      "நம்பகமான ஆசிரியர்களை கண்டுபிடித்து, சுயவிவரங்களை ஒப்பிட்டு, சரியான கற்றல் ஆதரவை விரைவாக பெறுங்கள்.",
    footerProductTitle: "தயாரிப்பு",
    footerResourcesTitle: "வளங்கள்",
    footerOverview: "கண்ணோட்டம்",
    footerFeatures: "அம்சங்கள்",
    footerTutors: "ஆசிரியர்கள்",
    footerJoin: "சேருங்கள்",
    footerStudentLogin: "மாணவர் உள்நுழைவு",
    footerTutorLogin: "ஆசிரியர் உள்நுழைவு",
    footerSignUp: "பதிவு செய்யுங்கள்",
    footerStayUpdated: "புதுப்பித்த நிலையில் இருங்கள்",
    footerEmailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடுங்கள்",
    footerSubscribe: "Subscribe செய்யுங்கள்",
    footerAllRightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

    // ── Tutor dashboard ───────────────────────────────────────────────────────
    tutorDashboardLabel: "ஆசிரியர் dashboard",
    studentDashboardLabel: "மாணவர் dashboard",
    welcomeBack: "மீண்டும் வருக",
    loading: "ஏற்றுகிறோம்…",
    editProfile: "சுயவிவரத்தை திருத்து",
    publicProfile: "பொது சுயவிவரம்",
    proPlan: "Pro திட்டம்",
    signOutBtn: "வெளியேறு",
    signingOut: "வெளியேறுகிறோம்…",

    activeStudents: "செயலில் உள்ள மாணவர்கள்",
    sessionsThisWeek: "இந்த வாரம் அமர்வுகள்",
    averageRating: "சராசரி மதிப்பீடு",
    payingSubscribers: "கட்டணம் செலுத்தும் subscribers",
    liveMeetingsSub: "நேரடி கூட்டங்கள்",
    reviews: "மதிப்புரைகள்",
    review: "மதிப்புரை",

    liveClasses: "நேரடி வகுப்புகள்",
    newMeeting: "புதிய கூட்டம்",
    creating: "உருவாக்குகிறோம்…",
    noMeetingsYet: "கூட்டங்கள் இல்லை",
    noMeetingsDesc: "தொடங்க 'புதிய கூட்டம்' கிளிக் செய்யுங்கள்",
    joinRoom: "அறைக்குள் நுழையுங்கள்",
    joinClass: "வகுப்பில் சேருங்கள்",
    join: "சேருங்கள்",

    profileSection: "சுயவிவரம்",
    nameLabel: "பெயர்",
    emailLabel: "மின்னஞ்சல்",
    roleLabel: "பதவி",
    accountLabel: "கணக்கு",
    verifiedTutorRole: "சரிபார்க்கப்பட்ட ஆசிரியர்",
    studentRole: "மாணவர்",
    quickLinks: "விரைவு இணைப்புகள்",
    manageMeetings: "கூட்டங்களை நிர்வகி",
    upgradeToPro: "Pro க்கு தரம் உயர்த்து",
    viewPublicProfile: "பொது சுயவிவரம் பார்க்கவும்",

    // ── Student dashboard ─────────────────────────────────────────────────────
    liveMeetingsLabel: "நேரடி கூட்டங்கள்",
    savedTutorsLabel: "சேமிக்கப்பட்ட ஆசிரியர்கள்",
    activeSubscriptions: "செயலில் உள்ள subscriptions",
    fromSubscribedTutors: "subscribe செய்த ஆசிரியர்களிடமிருந்து",
    onYourList: "உங்கள் பட்டியலில்",
    tutorChannels: "ஆசிரியர் channels",

    noLiveMeetingsYet: "நேரடி கூட்டங்கள் இல்லை",
    noLiveDesc1: "நேரடி வகுப்புகளில் சேர ஒரு ஆசிரியரை subscribe செய்யுங்கள்",
    noLiveDesc2: "உங்கள் ஆசிரியர் இன்னும் கூட்டத்தை தொடங்கவில்லை",

    messages: "செய்திகள்",
    noMessagesYet: "செய்திகள் இல்லை",
    messageTutorHint: "அவர்களின் சுயவிவர பக்கத்திலிருந்து ஆசிரியருக்கு செய்தி அனுப்புங்கள்",
    noMessagesStudentHint: "அவர்களின் சுயவிவர பக்கத்திலிருந்து ஆசிரியருக்கு செய்தி அனுப்புங்கள்",

    savedTutorsTitle: "சேமிக்கப்பட்ட ஆசிரியர்கள்",
    browse: "உலாவுங்கள்",
    noSavedTutors:
      "சேமிக்கப்பட்ட ஆசிரியர்கள் இல்லை — சேமிக்க எந்த ஆசிரியர் சுயவிவரத்திலும் heart ஐகானை தட்டுங்கள்.",
    tips: "குறிப்புகள்",
    tipsDesc:
      "பாடம், நிலை மற்றும் இடத்திற்கு பொருத்த ஆசிரியர் directory இல் filters ஐ பயன்படுத்துங்கள். விரும்பிய ஆசிரியர்களை favourite செய்யுங்கள்.",

    tutorInvitedYou: "உங்கள் ஆசிரியர் உங்களை அழைத்தார்",
    inviteReceived: "அழைப்பு பெறப்பட்டது",
    liveNow: "இப்போது நேரடி",
    live: "நேரடி",

    findTutors: "ஆசிரியர்களை கண்டுபிடி",

    // ── All Tutors page ───────────────────────────────────────────────────────
    allTutorsHeadline: "உங்கள் ஆசிரியரை கண்டுபிடியுங்கள்",
    allTutorsDesc: "இலங்கை முழுவதும் சரிபார்க்கப்பட்ட ஆசிரியர்களை உலாவுங்கள்.",
    searchPlaceholder: "பெயர், பாடம் அனுசரித்து தேடுங்கள்…",
    clearSearch: "தேடலை அழிக்கவும்",
    allSubjects: "அனைத்து பாடங்கள்",
    subjectBiology: "உயிரியல்",
    subjectICT: "ICT",
    subjectBusiness: "வணிகம்",
    anyPrice: "எந்த விலையும்",
    anyRating: "எந்த மதிப்பீடும்",
    highestRated: "அதிக மதிப்பீடு",
    priceLowToHigh: "விலை: குறைவிலிருந்து அதிகம்",
    priceHighToLow: "விலை: அதிகத்திலிருந்து குறைவு",
    nameAZ: "பெயர் (A → Z)",
    noTutorsFound: "உங்கள் வடிகட்டிகளுக்கு ஆசிரியர்கள் கிடைக்கவில்லை.",
    tutorsMatchFilters_one: "{count} ஆசிரியர் உங்கள் வடிகட்டிகளுக்கு பொருந்துகிறார்",
    tutorsMatchFilters_many: "{count} ஆசிரியர்கள் உங்கள் வடிகட்டிகளுக்கு பொருந்துகின்றனர்",
    tutorsEmptyHint:
      "விலை வரம்பை விரிவாக்கவும், மதிப்பீட்டு வரம்பை குறைக்கவும், அல்லது வேறு பாடத்துக்கு மாற்றவும்.",
    resetFilters: "வடிகட்டிகளை மீட்டமை",
    viewProfile: "சுயவிவரம் பார்க்கவும்",
    generalSubject: "பொது",
    featuredBadge: "சிறப்பு",
    verifiedBadge: "சரிபார்க்கப்பட்டது",
    newTutor: "புதிய ஆசிரியர்",
    fromLabel: "முதல்",
    rateOnProfile: "விலை சுயவிவரத்தில்",
    perHourShort: "/மணி",

    // ── Tutor profile page ───────────────────────────────────────────────────
    loadingTutorProfile: "ஆசிரியர் சுயவிவரம் ஏற்றப்படுகிறது...",
    profileBoostBadge: "சுயவிவர ஊக்கம்",
    yearsExperienceShort: "{count}+ ஆண்டுகள் அனுபவம்",
    bookSession: "அமர்வு முன்பதிவு",
    messageButton: "செய்தி",
    whatsappButton: "WhatsApp",
    processingEllipsis: "செயலாக்குகிறது…",
    subscribeLiveClasses: "நேரடி வகுப்புகளுக்கு subscribe செய்யவும்",
    saved: "சேமிக்கப்பட்டது",
    saveTutor: "ஆசிரியரை சேமிக்கவும்",

    unavailable: "கிடைக்கவில்லை",
    bookNowWithSelection: "இப்போது முன்பதிவு · {slot}",
    selectSlotToBook: "முன்பதிவுக்கு ஒரு நேரத்தைத் தேர்ந்தெடுக்கவும்",

    thanksForReview: "உங்கள் மதிப்புரைக்கு நன்றி!",
    leaveReview: "மதிப்புரை எழுதுங்கள்",
    reviewPlaceholder: "உங்கள் அனுபவத்தை பகிருங்கள் (விருப்பம்)…",
    submittingEllipsis: "சமர்ப்பிக்கிறது…",
    submitReview: "மதிப்புரையை சமர்ப்பிக்கவும்",

    messageTutorTitle: "{name}க்கு செய்தி",
    messageTutorPlaceholder:
      "வணக்கம் {name}, உங்கள் சுயவிவரத்தை Smart Tuition Finder இல் பார்த்தேன்…",
    cancel: "ரத்து",
    sendingEllipsis: "அனுப்புகிறது…",

    tutorNotFoundTag: "404 · ஆசிரியர் கிடைக்கவில்லை",
    tutorNotFoundHeadline: "அந்த ஆசிரியரை கண்டுபிடிக்க முடியவில்லை.",
    tutorNotFoundDesc:
      "நீங்கள் தேடும் ஆசிரியர் இடம் மாற்றியிருக்கலாம் அல்லது Smart Tuition Finder இல் இனி செயல்படாமல் இருக்கலாம். முகப்பில் உள்ள featured ஆசிரியர்களை உலாவுங்கள்.",
    backToHomepage: "முகப்புக்கு திரும்பவும்",

    signInStudentToSaveTutorsToast:
      "ஆசிரியர்களை சேமிக்க மாணவராக உள்நுழையவும்.",
    removedFromSavedToast: "சேமித்த பட்டியலிலிருந்து நீக்கப்பட்டது.",
    tutorSavedToast: "ஆசிரியர் உங்கள் பட்டியலில் சேமிக்கப்பட்டார்!",
    couldNotUpdateSavedToast:
      "சேமித்த நிலையை புதுப்பிக்க முடியவில்லை.",
    sessionBookedForToast: "{slot}க்கு அமர்வு முன்பதிவு செய்யப்பட்டது 🎉",
    selectSlotBelowToast:
      "தொடர கீழே ஒரு நேரத்தைத் தேர்ந்தெடுக்கவும்.",
    whatsAppNumberNotAvailableToast:
      "இந்த ஆசிரியருக்கு WhatsApp எண் கிடைக்கவில்லை.",
    signInStudentToSubscribeToast:
      "subscribe செய்ய மாணவராக உள்நுழையவும்.",
    paymentReceivedToast:
      "கட்டணம் பெறப்பட்டது. பாதுகாப்பான சரிபார்ப்புக்கு பிறகு subscription செயல்படும்.",
    subscriptionCancelledToast: "Subscription கட்டணம் ரத்து செய்யப்பட்டது.",
    paymentFailedToast: "கட்டணம் தோல்வியடைந்தது: {error}",
    couldNotStartSubscriptionToast:
      "Subscription checkout தொடங்க முடியவில்லை.",
    signInStudentToMessageTutorToast:
      "இந்த ஆசிரியருக்கு செய்தி அனுப்ப மாணவராக உள்நுழையவும்.",
    messageSentToast: "செய்தி அனுப்பப்பட்டது!",

    shareTutorProfileText: "Smart Tuition Finder இல் {name}யை பாருங்கள்",
    whatsAppIntroMessage:
      "வணக்கம் {name}, உங்கள் சுயவிவரத்தை Smart Tuition Finder இல் கண்டேன்.",

    profileAboutTitle: "ஆசிரியர் பற்றி",
    profileAboutEmpty:
      "இந்த ஆசிரியர் 'பற்றி' பகுதியை இன்னும் சேர்க்கவில்லை.",
    qualificationsTitle: "தகுதிகள் & அனுபவம்",
    qualificationsEmpty:
      "தகுதி அல்லது அனுபவ விவரங்கள் இன்னும் சேர்க்கப்படவில்லை.",
    subjectsGradesTitle: "பாடங்கள் & தரங்கள்",
    subjectsGradesEmpty: "பாடங்கள் அல்லது தரங்கள் இன்னும் சேர்க்கப்படவில்லை.",
    subjectGeneric: "பாடம்",
    demoVideosTitle: "டெமோ வீடியோக்கள்",
    videosCount: "{count} வீடியோக்கள்",
    demoVideosEmpty: "டெமோ வீடியோக்கள் இன்னும் சேர்க்கப்படவில்லை.",
    studentReviewsTitle: "மாணவர் மதிப்புரைகள்",
    noReviewsYet:
      "இன்னும் மதிப்புரைகள் இல்லை. முதலில் நீங்கள் ஒன்று எழுதுங்கள்!",
    anonymous: "அநாமதேயம்",
    availabilityBookingTitle: "கிடைக்கும் நேரங்கள் & முன்பதிவு",
    availabilityNotAddedEmpty:
      "கிடைக்கும் நேர விவரங்கள் இன்னும் சேர்க்கப்படவில்லை.",

    // ── Form validation & auth ─────────────────────────────────────────────────
    fullNamePlaceholder: "உ.கா: Priya Wickramasinghe",
    pleaseEnterFullName: "கரुணையுடன் உங்கள் முழு பெயரை உள்ளிடுங்கள்.",
    emailAddressLabel: "மின்னஞ்சல் முகவரி",
    passwordLabel: "கடவுச்சொல்",
    confirmPasswordLabel: "கடவுச்சொல் உறுதிப்படுத்து",
    confirmPassword: "உங்கள் கடவுச்சொல்லை மீண்டும் உள்ளிடுங்கள்",
    passwordAtLeast8: "குறைந்தபட்சம் 8 எழுத்துகள்",
    passwordStrengthHint: "8+ எழுத்துக்கள் எழுத்து மற்றும் இலக்கங்களுடன் பயன்படுத்தவும்.",
    passwordsNotMatch: "கடவுச்சொல்கள் பொருந்தவில்லை.",
    agreeToTerms: "நான் விதிமுறைகள் மற்றும் கோपनीयता கொள்கையை ஒப்புக்கொள்கிறேன்",
    acceptTermsRequired: "கருணையுடன் விதிமுறைகள் மற்றும் கோपनीयता கொள்கையை ஏற்றுக்கொள்ளவும்.",
    createAccount: "கணக்கை உருவாக்கு",
    createStudentAccountBtn: "மாணவர் கணக்கை உருவாக்கு",
    createTutorAccountBtn: "ஆசிரியர் கணக்கை உருவாக்கு",

    // ── Signup page ────────────────────────────────────────────────────────────
    studentsAndTutorsStartHere: "மாணவர்கள் மற்றும் ஆசிரியர்கள் இங்கே தொடங்குகின்றனர்.",
    signupAsideDesc: "ஒரே இடத்தில் இலவச கணக்கை உருவாக்குங்கள். நீங்கள் சமர்ப்பிக்கும் முன் எப்போதும் மாணவர் மற்றும் ஆசிரியர் பதிவுக்கு இடையে மாறவும்.",
    roleSpecificDashboards: "உள்நுழைந்த பிறகு பாத்திரம்-குறிப்பிட்ட dashboards",
    secureEmailSignup: "பாதுகாப்பான மின்னஞ்சல் மற்றும் கடவுச்சொல் பதிவு",
    builtForSriLanka: "இலங்கைக் கற்பவர்களுக்கும் கல்வியாளர்களுக்கும் கட்டப்பட்டுள்ளது",
    chooseStudentOrTutor: "மாணவர் அல்லது ஆசிரியரைத் தேர்ந்தெடுத்து, பின்னர் வடிவத்தை நிறைவுசெய்யவும்.",

    // ── Student register ───────────────────────────────────────────────────────
    findPerfectTutorMinutes: "சில நிமிடங்களில் சரியான ஆசிரியரை கண்டுபிடியுங்கள்.",
    studentRegisterAside: "உங்களுக்கு அருகில் சிறந்த ஆசிரியர்களை உலாவ, சேமிக்க மற்றும் সংযோகிக்க இலவச மாணவர் கணக்கை உருவாக்குங்கள்.",
    discoverVerifiedTutors: "இலங்கை முழுவதும் சரிபார்க்கப்பட்ட ஆசிரியர்களைக் கண்டறியுங்கள்",
    filterBySubjectGrade: "விஷயம், தரம், இடம் மற்றும் பட்ஜெட்டைக் கொண்டு வடிகட்டவும்",
    saveFavouriteTutors: "பிடித்த ஆசிரியர்களைச் சேமிக்கவும் மற்றும் உடனடியாக அவர்களுடன் தொடர்புகொள்ளவும்",
    trackLearningJourney: "ஒரே இடத்திலிருந்து உங்கள் கற்றல் பயணத்தைக் கண்காணியுங்கள்",
    displayNameLabel: "பெயரைக் காட்டவும்",
    bioLabel: "जीवनी",
    addShortBio: "ஆசிரியர்கள் உங்கள் கற்றல் இலக்குகளைப் புரிந்துகொள்ள குறுகிய அளவிலான வாழ்க்கை சரிதைச் சேர்க்கவும்.",
    bioPlaceholder: "உங்கள் தரம், இலக்கு மற்றும் ஆசிரியரிடம் நீங்கள் எதை எதிர்பார்க்கிறீர்கள் என்பது பற்றிய சில வரிகள்.",
    charactersRemaining: "/600 எழுத்துகள்",

    // ── Student profile edit ───────────────────────────────────────────────────
    yourStudentProfile: "உங்கள் மாணவர் சுயவிவரம்",
    keepProfileUpToDate: "உங்கள் சுயவிவரத்தை புதுப்பித்த நிலায় வைக்கவும்",
    profileHelpText: "உங்கள் பெயர் மற்றும் வாழ்க்கை சரிதை ஆசிரியர்களை உங்களை அங்கீகரிக்க உதவுகிறது. மாற்றங்கள் தானாக சேமிக்கப்படுகின்றன.",
    profileBasics: "சுயவிவரம் அடிப்படைகள்",
    profileBasicsDesc: "நீங்கள் தொடர்புகொள்ளும்போது ஆசிரியர்கள் பெயர் மற்றும் குறுகிய வாழ்க்கை சரிதை பார்ப்பார்கள்.",
    loadingProfile: "உங்கள் சுயவிவரம் ஏற்றப்படுகிறது…",
    backToDashboard: "Dashboard க்கு திரும்பவும்",

    // ── Tutor register ────────────────────────────────────────────────────────
    tutorRegisterAside: "நீங்கள் விரும்புவதை கற்பியுங்கள். மாணவர் தளத்தை வளர்த்துக்கொள்ளுங்கள்.",

    // ── Tutor profile edit ─────────────────────────────────────────────────────
    editTutorProfile: "ஆசிரியர் சுயவிவரத்தை திருத்து",
    yourTutorProfile: "உங்கள் ஆசிரியர் சுயவிவரம்",

    // ── Tutor own profile ──────────────────────────────────────────────────────
    loadingProfileEllipsis: "உங்கள் சுயவிவரம் ஏற்றப்படுகிறது...",

    // ── Tutor Pro plan ────────────────────────────────────────────────────────
    proPlusTitle: "Pro Plus",
    proMaxTitle: "Pro Max",
    growthPlanForTutors: "செயலில் உள்ள ஆசிரியர்களுக்கான வளர்ச்சி திட்டம்",
    maximumVisibilityForTutors: "தீவிர ஆசிரியர்களுக்கான அதிகம் தெரிவுநிலை",
    profileBoostInSearch: "ஆசிரியர் தேடலில் சுயவிவர பூஸ்ட்",
    verifiedBlueMark: "ஆசிரியர் கார்ட் மற்றும் சுயவிவரத்தில் சரிபார்க்கப்பட்ட நீல குறி",
    priorityPlacement: "பாடம் வகைகளில் முன்னுரிமை வைப்பு",
    basicProAnalytics: "அடிப்படை Pro பகுப்பாய்வு dashboard",
    everythingInProPlus: "Pro Plus இல் அனைத்தும்",
    strongerBoostInLists: "பட்டியல்கள் மற்றும் சிறப்பு வரிசையில் வலுவான பூஸ்ட்",
    prioritySupportResponse: "முன்னுரிமை ஆதரவு பதிலளிக்கும்",
    advancedLeadInsights: "அதிநவீன முன்னணி அন்தர்দृष்टி மற்றும் மாற்றுதல் போக்குகள்",
    payWithPayHere: "PayHere மூலம் பணம் செலுத்தவும்",
    paymentSuccessful: "பணம் செலுத்துதல் வெற்றிகரமாக இருந்தது",
    paymentCompletedDbFailed: "பணம் செலுத்துதல் முடிந்தது, ஆனால் டேটாબேஸ் புதுப்பீடு தோல்வியுற்றது",
    paymentCancelled: "பணம் செலுத்துதல் ரத்து செய்யப்பட்டது.",
    paymentError: "PayHere பிழை",
    proStatusActivated: "சரிபார்க்கப்பட்ட நீல குறி மற்றும் சுயவிவர பூஸ்ட் இப்போது செயல்படுத்தப்பட்டுள்ளது.",

    // ── Payment status page ────────────────────────────────────────────────────
    paymentFailed: "பணம் செலுத்துதல் தோல்வியுற்றது அல்லது ரத்து செய்யப்பட்டது",
    subscriptionActivationSoon: "உங்கள் பணம் பெறப்பட்டுள்ளது. சந்தாவு செயல்படுத்தல் விரைவில் உறுதிப்படுத்தப்படும்.",
    proStatusUpdateSoon: "உங்கள் பணம் பெறப்பட்டுள்ளது. உங்கள் Pro நிலை புதுப்பீடு விரைவில் உறுதிப்படுத்தப்படும்.",
    paymentNotCompleted: "உங்கள் பணம் செலுத்துதல் முடிந்து விடவில்லை. கருணையுடல் மீண்டும் முயற்சிக்கவும்.",
    backToTutorProfiles: "ஆசிரியர் சுயவிவரங்களுக்குத் திரும்பவும்",
    backToProPlans: "Pro திட்டங்களுக்குத் திரும்பவும்",
    goToDashboard: "Dashboard க்குச் செல்லவும்",

    // ── Tutor profile ─────────────────────────────────────────────────────────
    noDetailsAddedYet: "இன்னும் விவரங்கள் சேர்க்கப்படவில்லை.",
    ratePerhour: "/ மணிநேரம்",
    rateNotSet: "விகிதம் அமைக்கப்படவில்லை",
    removeBookmark: "வெற்றிடம் அகற்றவும்",
    saveTutorBookmarks: "இந்த ஆசிரியரை வெற்றிடங்களுக்குச் சேமிக்கவும்",
    reviewsCount: "மீளாய்வுகள்",

    // ── Live join page ────────────────────────────────────────────────────────
    loadingMeeting: "சந்திப்பு ஏற்றப்படுகிறது...",
    meetingNotFound: "சந்திப்பு கண்டறியப்படவில்லை.",
    meetingPasscode: "சந்திப்பு கடவுக்கோடு (தேவைப்பட்டால்)",
    enterPasscode: "கடவுக்கோட்டை உள்ளிடவும்",

    // ── Tutor live meeting ─────────────────────────────────────────────────────
    loadingRoom: "அறை ஏற்றப்படுகிறது…",
    meetingNotFoundHost: "சந்திப்பு கண்டறியப்படவில்லை அல்லது நீங்கள் புரவலர் இல்லை.",
    copied: "நகல் செய்யப்பட்டது",
    copyInvite: "அழைப்பை நகல் செய்யவும்",
    passcode: "கடவுக்கோடு",
    goLive: "நேரடி செல்க",
    meetingEnded: "சந்திப்பு முடிந்துவிட்டது",
    sessionFinished: "இந்தக் கூட்டம் முடிந்துவிட்டது.",
    scheduled: "திட்டமிடப்பட்டுள்ளது",
    ended: "முடிந்துவிட்டது",
    setPasscodeOptional: "கடவுக்கோட்டை அமைக்கவும் (அகற்ற வெற்று வை விடவும்)",
    save: "சேமிக்கவும்",
    setPasscodePlaceholder: "உ.கா: 123456",

    // ── Tutor live host ───────────────────────────────────────────────────────
    hostLiveClasses: "நேரடி வகுப்புகளை ஹோஸ்ட் செய்க",
    createRunLiveLessons: "Smart Tuition Finder இல் நேரடி பாடங்களை உருவாக்கி இயக்கவும்.",
    checkingProAccess: "உங்கள் Pro அணுகலைச் சரிபார்க்கிறது...",
    tutorProRequired: "நேரடி வகுப்புகளை ஹோஸ்ட் செய்ய Tutor Pro தேவை.",
    upgradeNow: "இப்போது மேம்படுத்தவும்",
    createMeeting: "சந்திப்பை உருவாக்கு",
    meetingTitle: "தலைப்பு",
    meetingDescription: "விளக்கம்",
    meetingPasscodeOptional: "சந்திப்பு கடவுக்கோடு (விரும்பலாக)",
    enableWaitingRoom: "காத்திருக்கும் அறையை இயக்கவும்",
    startsAt: "தொடங்குவது:",
    endsAt: "முடிவடைகிறது:",

    // ── Live chat panel ───────────────────────────────────────────────────────
    liveChat: "நேரடி சாட்",
    askQuestionInClass: "நேரடி வகுப்பில் ஒரு கேள்வி கேளுங்கள்...",
    sendMessage: "செய்தி அனுப்பவும்",

    // ── Polls & QA panel ───────────────────────────────────────────────────────
    polls: "வாக்குக்கணிப்புகள்",
    pollQuestion: "வாக்குக்கணிப்பு கேள்வி",
    oneOptionPerLine: "வரிக்கு ஒரு விருப்பம்",
    createPoll: "வாக்குக்கணிப்பு உருவாக்கவும்",
    closePoll: "வாக்குக்கணிப்பை மூடவும்",
    qa: "கேள்விநேர",
    askQuestion: "ஒரு கேள்வி கேளுங்கள்...",
    ask: "கேளுங்கள்",
    answered: "பதிலளிக்கப்பட்டது",
    markAnswered: "பதிலளிக்கப்பட்ட என்று குறிக்கவும்",

    // ── Raise hand panel ───────────────────────────────────────────────────────
    raiseHand: "கை ஏற்றவும்",
    lowerHand: "கையை இறக்கவும்",
    you: "நீங்கள்",
    raised: "ஏற்றப்பட்டது",
    idle: "செயல்படாத",

    // ── Participant grid ───────────────────────────────────────────────────────
    guest: "விருந்தினர்",
    screen: "பெரிய திரை",

    // ── FAQ ────────────────────────────────────────────────────────────────────
    frequentlyAskedQuestions: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqSubtitle: "ஆசிரியர்களைக் கண்டுபிடிப்பது, பதிவுசெய்தல், சுயவிவரங்கள் மற்றும் Smart Tuition Finder பயன்பாடு பற்றிய விரைவான பதிலளிக்கும்.",
    howFindRightTutor: "சரியான ஆசிரியரை எப்படி கண்டுபிடிப்பது?",
    howFindRightTutorAns: "விஷயம், தரம் மற்றும் இடம் மூலம் தேட எங்கள் மேம்பட்ட வடிகட்டிகளைப் பயன்படுத்தவும். ஆசிரியர் சுயவிவரங்கள் மற்றும் மீளாய்வுகளை படித்து தகுதிகள் மற்றும் கற்பித்தல் பாணிகளை ஒப்பிடுங்கள்.",
    areTutorProfilesVerified: "ஆசிரியர் சுயவிவரங்கள் சரிபார்க்கப்பட்டுள்ளனவா?",
    areTutorProfilesVerifiedAns: "ஆம், Smart Tuition Finder இல் உள்ள அனைத்து ஆசிரியர்களும் சரிபார்ப்பு செயல்முறை வழியாக செல்கிறார்கள். அவர்களின் சுயவிவரத்தில் சரிபார்ப்பு கண்ணியைக் கோருங்கள்.",
    howLongRegistration: "பதிவு செய்வது எவ்வளவு நேரம் எடுக்கும்?",
    howLongRegistrationAns: "பதிவு செய்வது 2-3 நிமிடங்கள் எடுக்கும். உங்கள் விவரங்களை நிரப்பவும், கடவுச்சொல்லை உருவாக்கவும், உடனடியாக ஆசிரியர்களை உலாவவும்.",
    canTutorsEditProfile: "ஆசிரியர்கள் பின்னர் தங்கள் சுயவிவரத்தை திருத்த முடியுமா?",
    canTutorsEditProfileAns: "ஆம், ஆசிரியர்கள் தங்கள் சுயவிவரத் தகவல், விகிதங்கள், கிடைக்கூடிய தன்மை மற்றும் சுயவிவர படத்தை எப்போது வேண்டுமானாலும் தங்களின் dashboard தில் இருந்து புதுப்பிக்க முடியும்.",
    canStudentsSaveTutors: "மாணவர்கள் ஆசிரியர்களைச் சேமிக்க அல்லது ஒப்பிட முடியுமா?",
    canStudentsSaveTutorsAns: "நிச்சயமாக! மாணவர்கள் பிடித்தவர்களுக்கு ஆசிரியர்களைச் சேமிக்க முடியும் மற்றும் தீர்மானம் செய்வதற்கு முன்பு பல சுயவிவரங்களை ஒப்பிட முடியும்.",
    howStudentsContactTutors: "மாணவர்கள் ஆசிரியர்களுடன் எப்படி தொடர்புகொள்கிறார்கள்?",
    howStudentsContactTutorsAns: "மாணவர்கள் தங்கள் சுயவிவர பக்கத்திலிருந்து ஆசிரியர்களுக்கு நேரடி செய்திகளை அனுப்ப முடியும். ஆசிரியர்கள் வழக்கமாக 24 மணிநேரத்தில் பதிலளிக்கிறார்கள்.",
    whatSubjectsSupported: "எந்த பாடங்கள் ஆதரிக்கப்படுகின்றன?",
    whatSubjectsSupportedAns: "நாங்கள் கணிதம், அறிவியல், ஆங்கிலம், வரலாறு, கலை, இயற்பியல், உயிரியல், ICT மற்றும் பல பாடங்களை அனைத்து நிலைகளிலும் ஆதரிக்கிறோம்.",
    isThereFee: "தளத்தைப் பயன்படுத்தக் கட்டணம் உள்ளதா?",
    isThereFeAns: "கணக்கை உருவாக்குவது மற்றும் ஆசிரியர்களைத் தேடுவது முற்றிலும் இலவசம். சில ஆசிரியர்கள் பிரீமியம் செயல்பாடுகளை அல்லது சந்தா-அடிப்படை அமர்வுகளை வழங்குகிறார்கள்.",
    whoCanJoinAsTutor: "ஆசிரியரைக் கண்டுபிடிக்க யார் சேரலாம்?",
    whoCanJoinAsTutorAns: "எந்த தகுந்த கல்வியாளரோ அனுபவம் வாய்ந்த ஆசிரியரோ சேரலாம். மொத்த பயனர்களுக்கான தரம் மற்றும் பாதுகாப்பு உறுதிப்படுத்த நாங்கள் சுயவிவரங்களை மதிப்பாய்வு செய்கிறோம்.",

    // ── Supabase setup notice ──────────────────────────────────────────────────
    supabaseNotConfigured: "Supabase கட்டமைக்கப்படவில்லை",
    supabaseSetupInstructions: "`.env.local` க்கு Supabase URL மற்றும் anon key சேர்க்கவும் (`.env.example` பார்க்கவும்), பின்னர் SQL சம்பாதிப்பில் `supabase/schema.sql` ஐ இயக்கவும் பதிவு மற்றும் உள்நுழைவை செயல்படுத்த.",
    supabaseIsntConfigured: "Supabase கட்டமைக்கப்படவில்லை",
    addSupabaseUrl: "Supabase URL மற்றும் விசையை `.env.local` க்கு சேர்க்கவும் மற்றும் dev சேவையகத்தை மீண்டும் தொடங்கவும்.",

    // ── Auth layout aside ──────────────────────────────────────────────────────
    teachWhatYouLove: "நீங்கள் விரும்புவதை கற்பியுங்கள்.",
    growYourStudentBase: "மாணவர் தளத்தை வளர்த்துக்கொள்ளுங்கள்.",
    tutorLayoutAside: "Smart Tuition Finder ஏற்கனவே பயன்படுத்தும் நூற்றுக்கணக்கான இலங்கை ஆசிரியர்களுடன் சேரவும் தங்களின் நாட்காட்டிகளை நிரப்பவும் மற்றும் விரிந்த மாணவர்களால் கண்டுபிடிக்கப்படவும்.",
    verifiedProfileVideos: "டெமோ வீடியோக்களுடன் சரிபார்க்கப்பட்ட சுயவிவரம்",
    smartMatchingStudents: "அருகிலுள்ள மாணவர்களுடன் smart பொருத்தம்",
    builtInSessionScheduling: "உள்ளமைக்கப்பட்ட அமர்வு திட்டமிடல்",

    // ── Form field ─────────────────────────────────────────────────────────────
    showPasswordBtn: "கடவுச்சொல்லைக் காட்டவும்",
    hidePasswordBtn: "கடவுச்சொல்லை மறைக்கவும்",

    // ── Gemini chatbot ────────────────────────────────────────────────────────
    messageCouldntProcess: "அந்த செய்தி செயல்படுத்த முடியவில்லை. வெவ்வேறு வார்த்தைகளில் கேளுங்கள்.",
    replyFiltered: "பதிலையல் வடிகட்டப்பட்டுள்ளது. குறுகிய அல்லது ஒரு பொதுவான கேள்வியை முயற்சிக்கவும்.",
    noReplyText: "மெலுவான பிரதிபலிப்பு உரை வரவில்லை. மற்றொரு மாதிரி வேலை செய்ய பட்டுள்ளது.",
    assistantNotConfigured: "உதவியாளர் இன்னும் கட்டமைக்கப்படவில்லை. VITE_GEMINI_API_KEY ஐ `.env.local` க்கு சேர்க்கவும், dev சேவையகத்தை மீண்டும் தொடங்கவும், பின்னர் மீண்டும் முயற்சிக்கவும்.",
    googleFreeQuotaExceeded: "இந்த API க்கான Google இன் இலவச கோட்டா மீறப்பட்டுள்ளது. தொடர்ந்து செயல்பட Google Cloud க்கு பணக்கணக்கைச் சேர்க்கவும்.",

    // ── Site header ────────────────────────────────────────────────────────────
    smartTuitionFinder: "Smart Tuition Finder",
    findLearnGrow: "கண்டுபிடி · கற்க · வளர்ந்து",
    courses: "பாடநெறிகள்",
    dashboard: "Dashboard",

    // ── Tutor directory filters ────────────────────────────────────────────────
    tutorDirectory: "ஆசிரியர் இயக்கஸ்",
    findYourNextTutor: "உங்கள் அடுத்த ஆசிரியரைக் கண்டுபிடியுங்கள்.",
    searchByNameSubject: "பெயர், விஷயம் அல்லது நகரம் மூலம் தேடவும், பின்னர் எளிய வடிகட்டிகளுடன் பட்டியலை சுத்திகரிக்கவும்.",
    underLKR3000: "LKR 3 000 க்கு குறைவாக",
    lkr3000To4500: "LKR 3 000 – 4 500",
    overLKR4500: "LKR 4 500 க்கு அதிகமாக",
    rating4Point5: "4.5+",
    rating4Point8: "4.8+",
    rating5: "5.0",
  },
};

// ── Module-level store (bypasses React context batching issues) ──────────────
let _lang = localStorage.getItem("app-lang") || "en";
const _listeners = new Set();

function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function getSnapshot() {
  return _lang;
}

function setLanguage(code) {
  if (_lang === code) return;
  _lang = code;
  localStorage.setItem("app-lang", code);
  document.documentElement.lang = code;
  _listeners.forEach((fn) => fn());
}

// ── No-op provider kept for compatibility ────────────────────────────────────
export function LanguageProvider({ children }) {
  return children;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot);
  return { lang, setLang: setLanguage, t: translations[lang] };
}
