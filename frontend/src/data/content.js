// Static content: brand assets, master artists, before/after pairs, testimonials.
// Service catalog comes from backend (GET /api/services) so prices/deposits stay server-authoritative.

export const BRAND_LOGO_URL =
    "https://customer-assets.emergentagent.com/job_f6f9a757-ba2b-4ccc-a0f3-159582be4ba3/artifacts/4dkdw2vp_browsems-logo.png";

// Backend proxies the user-supplied hero video. The actual src is constructed at runtime
// in ScrollVideoHero from REACT_APP_BACKEND_URL.
export const HERO_VIDEO_PATH = "/api/hero-video";

export const HERO_POSTER_URL =
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80&auto=format&fit=crop";

// Master artists ------------------------------------------------------------
export const artists = [
    {
        key: "elena",
        name: "Elena Marín",
        title: { en: "Master Brow Artist · Founder", es: "Artista Máster · Fundadora" },
        bio: {
            en: "10+ years shaping brows. Phibrows-certified, with an obsession for golden-ratio mapping.",
            es: "Más de 10 años dando forma a cejas. Certificada Phibrows, obsesionada con el mapeo áureo.",
        },
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop",
        signature: ["Microblading", "Combo Brows"],
        instagram: "@elena.browsems",
    },
    {
        key: "marcus",
        name: "Marcus Quintero",
        title: { en: "Senior Pigment Artist", es: "Artista Pigmentista Senior" },
        bio: {
            en: "Specializes in microshading and lip blush. Trained in São Paulo, certified in PMU since 2017.",
            es: "Especialista en microshading y lip blush. Formado en São Paulo, certificado en PMU desde 2017.",
        },
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop",
        signature: ["Microshading", "Lip Blush"],
        instagram: "@marcus.browsems",
    },
    {
        key: "sasha",
        name: "Sasha Chen",
        title: { en: "Resident Artist", es: "Artista Residente" },
        bio: {
            en: "Natural, soft-strokes specialist. Loves dialed-in symmetry and warm cool-toned pigments.",
            es: "Especialista en trazos suaves y naturales. Le encanta la simetría precisa y pigmentos cálidos.",
        },
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80&auto=format&fit=crop",
        signature: ["Microblading", "Touch-Up"],
        instagram: "@sasha.browsems",
    },
];

// Before / After gallery ----------------------------------------------------
// Each pair is two real Unsplash brow/face photos. Captions identify the service.
export const beforeAfter = [
    {
        id: "ba1",
        before: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=900&q=80&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80&auto=format&fit=crop",
        service: { en: "Microblading", es: "Microblading" },
        artist: "Elena",
    },
    {
        id: "ba2",
        before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=900&q=80&auto=format&fit=crop",
        service: { en: "Microshading", es: "Microshading" },
        artist: "Marcus",
    },
    {
        id: "ba3",
        before: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=900&q=80&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=900&q=80&auto=format&fit=crop",
        service: { en: "Combo Brows", es: "Combo Brows" },
        artist: "Sasha",
    },
    {
        id: "ba4",
        before: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=900&q=80&auto=format&fit=crop",
        after: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80&auto=format&fit=crop",
        service: { en: "Lip Blush", es: "Lip Blush" },
        artist: "Marcus",
    },
];

// Testimonials --------------------------------------------------------------
export const testimonials = [
    {
        id: "t1",
        name: "Carla R.",
        rating: 5,
        text: {
            en: "I haven't touched a brow pencil in 14 months. Elena's mapping is a work of art.",
            es: "No he tocado un lápiz de cejas en 14 meses. El mapeo de Elena es una obra de arte.",
        },
    },
    {
        id: "t2",
        name: "Priya M.",
        rating: 5,
        text: {
            en: "The studio felt like a spa. Marcus walked me through every step. Lip blush — obsessed.",
            es: "El estudio se sintió como un spa. Marcus me explicó cada paso. Lip blush — obsesionada.",
        },
    },
    {
        id: "t3",
        name: "Jess D.",
        rating: 5,
        text: {
            en: "Sasha gave me the most natural microblading I've ever seen. People can't tell — they just say I look 'rested'.",
            es: "Sasha me hizo el microblading más natural que he visto. Nadie nota — solo dicen que me veo 'descansada'.",
        },
    },
];
