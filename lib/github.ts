import axios from "axios";

export interface FileMetadata {
  name: string;
  path: string;
  download_url: string | null; // Only for files
  type: string; // 'file' or 'dir'
}

export interface FileData {
  name: string;
  path: string;
  url: string | null; // URL for files
  type: string; // 'file' or 'dir'
  children?: FileData[]; // Nested files for directories
}

// const BASE_URL = "https://api.github.com";
export async function getFilesInRepo(
	folderPath = process.env.FOLDER_PATH as string
  ): Promise<FileData[]> {
	const token = process.env.GITHUB_TOKEN as string;
	const repoOwner = process.env.REPO_OWNER as string;
	const repoName = process.env.REPO_NAME as string;
	const branch = process.env.BRANCH as string;
  
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?ref=${branch}`;
  
	try {
	  const response = await axios.get<FileMetadata[]>(url, {
		headers: {
		  Authorization: `token ${token}`,
		},
	  });
  
	  const files = await Promise.all(
		response.data.map(async (item) => {
		  if (item.type === "dir") {
			const children = await getFilesInRepo(item.path);
			return {
			  name: item.name,
			  path: item.path,
			  url: null,
			  type: "dir",
			  children,
			};
		  }
		  return {
			name: item.name,
			path: item.path,
			url: item.download_url, // Use the download_url directly
			type: "file",
		  };
		})
	  );
  
	  return files;
	} catch (error) {
	  console.error("Error fetching files from GitHub:", error);
	  throw new Error("Failed to fetch files from GitHub.");
	}
  }
  