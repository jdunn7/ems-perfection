// Static placeholder product / story / instagram data shared across locales (price + images locale-agnostic).
// Product names exist in both EN and ES.

export const HERO_VIDEO_URL =
    "https://vids.videohosting.space/Kling%203_0%20Pro%20-%20Two%20glamorous%20cartoon%20princesses%20_one%20Black%20girl_%20one%20White%20girl_%20with%20flawless%20micr.mp4";

export const HERO_POSTER_URL =
    "https://images.unsplash.com/photo-1761498443962-1f00eed12137?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920";

export const BRAND_LOGO_URL =
    "https://customer-assets.emergentagent.com/job_f6f9a757-ba2b-4ccc-a0f3-159582be4ba3/artifacts/4dkdw2vp_browsems-logo.png";

export const products = [
    {
        id: "p1",
        slug: "velvet-lip-lacquer",
        names: { en: "Velvet Lip Lacquer", es: "Lacado Labial Velvet" },
        descs: {
            en: "12h water & transfer-proof matte lipstick with featherlight feel.",
            es: "Labial mate de 12h resistente al agua y al roce, con tacto pluma.",
        },
        variants: { en: "Dusty Rose", es: "Rosa Polvo" },
        price: "AED 90",
        image: "https://images.unsplash.com/photo-1773372238349-41899694df31?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    },
    {
        id: "p2",
        slug: "crown-brow-pomade",
        names: { en: "Crown Brow Pomade", es: "Pomada de Cejas Crown" },
        descs: {
            en: "Sculpting brow pomade with a creamy 24h-wear formula.",
            es: "Pomada esculpidora con fórmula cremosa de 24h de duración.",
        },
        variants: { en: "Brunette", es: "Castaño" },
        price: "AED 95",
        image: "https://images.pexels.com/photos/25355739/pexels-photo-25355739.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900",
    },
    {
        id: "p3",
        slug: "diamond-kiss-liner",
        names: { en: "Diamond Kiss Liner", es: "Delineador Diamond Kiss" },
        descs: {
            en: "Transfer-proof lip liner with precision filling, lasts up to 16 hours.",
            es: "Delineador labial resistente al roce y de precisión, dura hasta 16 horas.",
        },
        variants: { en: "Cashmere Rose", es: "Rosa Cashmere" },
        price: "AED 80",
        image: "https://images.unsplash.com/photo-1630417591406-6584f2d324bd?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    },
    {
        id: "p4",
        slug: "glam-eyes-palette",
        names: { en: "Glam Eyes Palette", es: "Paleta Glam Eyes" },
        descs: {
            en: "12 buttery shades from soft mattes to high-shine shimmers.",
            es: "12 tonos sedosos, de mates suaves a brillos intensos.",
        },
        variants: { en: "Sunset Dreams", es: "Sueños de Atardecer" },
        price: "AED 180",
        image: "https://images.pexels.com/photos/34567763/pexels-photo-34567763.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900",
    },
];

export const categories = [
    {
        key: "face",
        image: "https://images.unsplash.com/photo-1620912189865-cad4c43b53b5?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    },
    {
        key: "lips",
        image: "https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    },
    {
        key: "eyes",
        image: "https://images.unsplash.com/photo-1583241800698-9c2e0c4a6c2a?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    },
    {
        key: "brows",
        image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900",
    },
];

export const featuredImages = [
    "https://images.pexels.com/photos/7866530/pexels-photo-7866530.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1400",
    "https://images.unsplash.com/photo-1761498443962-1f00eed12137?crop=entropy&cs=srgb&fm=jpg&w=1400&q=85",
];

export const stories = [
    {
        id: "s1",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        titles: {
            en: "Bronze Goddess: Tips & Tricks",
            es: "Diosa Bronce: Tips y Trucos",
        },
        tag: "Featured",
    },
    {
        id: "s2",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        titles: {
            en: "Cherry & Strawberry: Fruity tints for cheeks & lips",
            es: "Cereza y Fresa: tintes frutales para mejillas y labios",
        },
        tag: "Featured",
    },
    {
        id: "s3",
        image: "https://images.unsplash.com/photo-1503236823255-94609f598e71?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
        titles: {
            en: "Summer Must-Haves for the Glow Season",
            es: "Imprescindibles de verano para la temporada glow",
        },
        tag: "Featured",
    },
];

export const instagramImages = [
    "https://images.unsplash.com/photo-1767288533191-cc2c72bad9c9?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    "https://images.unsplash.com/photo-1767360963892-3353defd6584?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    "https://images.unsplash.com/photo-1766242281507-dca096a98464?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    "https://images.unsplash.com/photo-1615793685200-5802ff8bbea7?crop=entropy&cs=srgb&fm=jpg&w=900&q=85",
    "https://images.pexels.com/photos/5566043/pexels-photo-5566043.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900",
    "https://images.pexels.com/photos/7773349/pexels-photo-7773349.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900",
];
