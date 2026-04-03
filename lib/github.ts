import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/github.json");
const USERNAME = "Priyaa-Rana";
const CACHE_DURATION = 1000 * 60 * 60; 

// Fetch data
async function fetchGitHubData() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
      )
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();

    const cleanRepos = Array.isArray(repos)
      ? repos
          .filter((repo: any) => !repo.fork)
          .sort(
            (a: any, b: any) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      : [];

    const data = {
      user: user?.message ? null : user,
      repos: cleanRepos,
      fetchedAt: Date.now()
    };

    //  Save cache
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return { user: null, repos: [] };
  }
}

// Get cached or fresh data
export async function getCachedData() {
  try {
    if (!fs.existsSync(filePath)) {
      console.log("No cache → fetching...");
      return await fetchGitHubData();
    }

    const file = fs.readFileSync(filePath, "utf-8");
    const cached = JSON.parse(file);

    const isExpired =
      !cached.fetchedAt ||
      Date.now() - cached.fetchedAt > CACHE_DURATION;

    if (isExpired) {
      console.log("Cache expired → refetching...");
      return await fetchGitHubData();
    }

    console.log("Using cached GitHub data");
    return cached;
  } catch (error) {
    console.error("Cache read error:", error);
    return await fetchGitHubData();
  }
}