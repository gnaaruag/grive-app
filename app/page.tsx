import { getFilesInRepo, FileData } from "@/lib/github";

export const metadata = {
  title: "File Viewer",
};

const FileViewerPage = async () => {
  // Dynamically fetch the latest files
  const files: FileData[] = await getFilesInRepo();

  const renderFiles = (fileList: FileData[], depth = 0) => (
    <ul
      style={{
        paddingLeft: `${depth * 20}px`,
        listStyle: "none",
        margin: 0,
      }}
    >
      {fileList.map((file) => (
        <li
          key={file.path}
          style={{
            border: depth === 0 ? "1px solid #ccc" : "none",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "left",
            marginBottom: "10px",
          }}
        >
          {/* Handle directories */}
          {file.type === "dir" ? (
            <div>
              <strong style={{ color: "blue" }}>📁 {file.name}</strong>
              {file.children && renderFiles(file.children, depth + 1)}
            </div>
          ) : file.url?.endsWith(".pdf") ? (
            // Display PDF in an iframe
            <iframe
              src={file.url}
              width="100%"
              height="400"
              title={file.name}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            ></iframe>
          ) : (
            // Link for other files
            <a
              href={file.url!}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {file.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1>File Viewer</h1>
      {renderFiles(files)}
    </div>
  );
};

export default FileViewerPage;
