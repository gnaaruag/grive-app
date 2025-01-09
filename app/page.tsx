import { getFilesInRepo, FileData } from "@/lib/github";
import Link from "next/link";

export const metadata = {
  title: "File Viewer",
};

// Disable caching for this page
export const dynamic = "force-dynamic";

const FileViewerPage = async () => {
  const files: FileData[] = await getFilesInRepo();

  const renderFiles = (fileList: FileData[], depth = 0) => (
    <ul className={`pl-${depth * 4} list-none m-0`}>
      {fileList.map((file) => (
        <li key={file.path} className="mb-2">
          {file.type === "dir" ? (
            <div>
              <strong className="text-blue-600">📁[{file.name}]</strong>
              {file.children && renderFiles(file.children, depth + 1)}
            </div>
          ) : file.url?.endsWith(".pdf") ? (
            <div className="mt-2 ml-4">
              <span className="text-green-600">{file.name}</span>
              <iframe
                src={file.url}
                width="100%"
                height="300"
                title={file.name}
                className="border border-gray-300 mt-1"
              ></iframe>
            </div>
          ) : (
            <a
              href={file.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-4"
            >
              📄{file.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="font-mono text-sm max-w-3xl mx-auto p-4 bg-gray-100">
      <Link
        href={"/"}
        className="hover:underline"
      >
        <h1 className="text-[#2563eb] decoration-[#2563eb] text-2xl font-bold mb-4 text-center">
          grive
        </h1>
      </Link>
      <div className="bg-white p-4 border border-gray-300">
        {renderFiles(files)}
      </div>
    </div>
  );
};

export default FileViewerPage;
