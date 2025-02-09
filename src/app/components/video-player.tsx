"use client"

interface VideoPlayerProps {
  url: string | null
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  if (!url) return null

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
      <video
        className="w-full h-full"
        controls
        src={url}
        controlsList="nodownload"
      >
        您的浏览器不支持视频播放。
      </video>
    </div>
  )
}