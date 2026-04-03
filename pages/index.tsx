import { getCachedData } from "../lib/github";


export async function getStaticProps() {
  const data = await getCachedData();

  const cleanData = JSON.parse(JSON.stringify(data));

  return {
    props: {
      user: cleanData.user ?? null,
      repos: cleanData.repos ?? []
    }
  };
}

export default function Home({ user, repos }) {
  if (!user) {
    return <p style={{ textAlign: "center" }}> Failed to load GitHub data</p>;
  }

  return (
    <div className="container">

     
      <div className="profile">
        <img src={user.avatar_url} />

        <h1>{user.name || user.login}</h1>

        <p>{user.bio}</p>

        <div className="stats">
          <span>Total repos:{user.public_repos}</span>
          <span>Number of follwers: {user.followers}</span>
          <span>Number of following {user.following}</span>
        </div>

        <a href={user.html_url} target="_blank" className="btn">
          Visit GitHub
        </a>
      </div>

      {/* Projects */}
      <h2>My Projects ({repos.length})</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Description</th>
              <th>Language</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Links</th>
            </tr>
          </thead>

          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
                <td>{repo.description || " "}</td>
                <td>{repo.language || " "}</td>
                <td> {repo.stargazers_count}</td>
                <td> {repo.forks_count}</td>
                <td>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    className="link"
                  >
                    Code
                  </a>

                  {repo.homepage && (
                    <>
                      {" | "}
                      <a
                        href={repo.homepage}
                        target="_blank"
                        className="link-green"
                      >
                        Live
                      </a>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        Built with Next.js + GitHub API
      </div>
    </div>
  );
}