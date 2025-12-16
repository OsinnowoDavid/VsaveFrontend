export const networks = [
    { id: "MTN", Icon: require("../assets/icons/mtn.png") },
    { id: "AIRTEL", Icon: require("../assets/icons/airtel.png") },
    { id: "GLO", Icon: require("../assets/icons/glo.png") },
    { id: "ETISALAT", Icon: require("../assets/icons/etisalat.png") },
];

export const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000];

export const dataPlans: Record<
    string,
    { id: string; label: string; price: number }[]
> = {
    mtn: [
        { id: "mtn1", label: "500MB - 30 Days", price: 500 },
        { id: "mtn2", label: "1GB - 30 Days", price: 1000 },
        { id: "mtn3", label: "5GB - 30 Days", price: 3000 },
    ],
    airtel: [
        { id: "air1", label: "750MB - 14 Days", price: 600 },
        { id: "air2", label: "1.5GB - 30 Days", price: 1200 },
        { id: "air3", label: "3GB - 30 Days", price: 2500 },
    ],
    glo: [
        { id: "glo1", label: "1GB - 14 Days", price: 500 },
        { id: "glo2", label: "2GB - 30 Days", price: 1000 },
        { id: "glo3", label: "6GB - 30 Days", price: 3000 },
    ],
    etisalat: [
        { id: "eti1", label: "500MB - 7 Days", price: 300 },
        { id: "eti2", label: "1.5GB - 30 Days", price: 1000 },
        { id: "eti3", label: "4GB - 30 Days", price: 2500 },
    ],
};
