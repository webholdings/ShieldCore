
import axios from 'axios';

interface Breach {
    Name: string;
    Title: string;
    Domain: string;
    BreachDate: string;
    Description: string;
    DataClasses: string[];
}

const XPOSED_OR_NOT_API = "https://api.xposedornot.com/v1/check-email";
const HIBP_API = "https://haveibeenpwned.com/api/v3/breachedaccount";

export async function checkHibpBreach(account: string): Promise<Breach[]> {
    try {
        const response = await axios.get(`${HIBP_API}/${encodeURIComponent(account)}?truncateResponse=false`, {
            headers: {
                'User-Agent': 'ShieldCore-Monitor',
            }
        });

        if (response.data && Array.isArray(response.data)) {
            return response.data.map((b: any) => ({
                Name: b.Name,
                Title: b.Title,
                Domain: b.Domain,
                BreachDate: b.BreachDate,
                Description: b.Description,
                DataClasses: b.DataClasses
            }));
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return []; // Not pwned
        }
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            console.warn("HIBP Rate Limit Exceeded");
            // Just warn and return empty for now to not crash the whole batch
            return [];
        }
        console.warn(`Error scanning HIBP for ${account}:`, error.message);
        return [];
    }
}

async function checkXposedOrNot(email: string): Promise<Breach[]> {
    try {
        const response = await axios.get(`${XPOSED_OR_NOT_API}/${email}`);

        if (!response.data || response.data.Error === "Not found") {
            return [];
        }

        if (response.data.Breaches && Array.isArray(response.data.Breaches)) {
            return response.data.Breaches.map((name: any) => ({
                Name: name[0] || "Unknown",
                Title: name[0] || "Unknown Breach",
                Domain: "unknown",
                BreachDate: new Date().toISOString().split('T')[0],
                Description: "Data exposed in public breach (Source: XposedOrNot).",
                DataClasses: ["Email", "User Data"]
            }));
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return [];
        console.warn(`Error scanning XposedOrNot for ${email}:`, error);
        return [];
    }
}

export async function checkEmailBreach(email: string): Promise<Breach[]> {
    // Run both scanners in parallel (careful with rate limits on HIBP)
    const [xpon, hibp] = await Promise.allSettled([
        checkXposedOrNot(email),
        checkHibpBreach(email)
    ]);

    const results: Breach[] = [];

    if (xpon.status === 'fulfilled') results.push(...xpon.value);
    if (hibp.status === 'fulfilled') results.push(...hibp.value);

    // Deduplicate by Name
    return Array.from(new Map(results.map(item => [item.Name, item])).values());
}
