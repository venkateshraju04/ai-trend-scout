export default function YoutubeCard({ video }) {
  const data = video.json || video;
  const { title, url, channel, publishedAt } = data;

  // Extract video ID from the URL
  const videoIdMatch = url?.match(/v=([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="flex flex-col items-center border p-3 rounded-md shadow-sm hover:shadow transition w-56">
      {thumbnail && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-32 object-cover rounded"
          />
        </a>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-medium text-blue-700 hover:underline mt-2 text-center"
      >
        {title}
      </a>
      <p className="text-sm text-gray-600 mt-1 text-center">📺 {channel}</p>
      {publishedAt && (
        <p className="text-xs text-gray-400 mt-0.5 text-center">
          {new Date(publishedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
