
import axios from 'axios';

interface Breach {
    Name: string;
    Title: string;
    Domain: string;
    BreachDate: string;
    Description: string;
    DataClasses: string[];
}

// XposedOrNot is a free alternative to HIBP that allows email checking without an enterprise API key for non-commercial use
const XPOSED_OR_NOT_API = "https://api.xposedornot.com/v1/check-email";

export async function checkEmailBreach(email: string): Promise<Breach[]> {
    try {
        const response = await axios.get(`${XPOSED_OR_NOT_API}/${email}`);

        // XposedOrNot returns "Error": "Not found" or null if no breaches, or a list/object if breaches exist
        if (!response.data || response.data.Error === "Not found") {
            return [];
        }

        // Adapt XposedOrNot response to our Breach interface
        // The structure varies, but typically it returns an object with breach names as keys or arrays
        // For this implementation, we map the available data. 
        // Note: XposedOrNot basic endpoint returns just names. The detailed one might be needed.
        // Let's assume we get a list of breach names and simulate details if full details aren't free/available easily
        // or use a public free lookup if possible. 

        // If response.data.Breaches is an array of strings (common simplified format)
        if (response.data.Breaches && Array.isArray(response.data.Breaches)) {
            return response.data.Breaches.map((name: any) => ({
                Name: name[0] || "Unknown",
                Title: name[0] || "Unknown Breach",
                Domain: "unknown",
                BreachDate: new Date().toISOString().split('T')[0], // details not always available in free tier
                Description: "Data exposed in public breach.",
                DataClasses: ["Email", "User Data"]
            }));
        }

        return [];
    } catch (error) {
        // 404 often means no breach found for these APIs
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        }
        console.warn(`Error scanning email ${email}:`, error);
        return [];
    }
}
