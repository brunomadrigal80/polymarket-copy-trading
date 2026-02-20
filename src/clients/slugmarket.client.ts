import axios from "axios";

export const slugmarketClient = axios.create({
    baseURL: "https://gamma-api.polymarket.com"
});



export async function getMarketBySlug(slug: string) {

    const res = await slugmarketClient.get(`/events/slug/${slug}`)

    return res.data;
}