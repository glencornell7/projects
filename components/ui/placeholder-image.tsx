interface PlaceholderImageProps {
  query: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function PlaceholderImage({ query, alt, width = 600, height = 400, className = "" }: PlaceholderImageProps) {
  return (
    <img
      src={`/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  )
}
