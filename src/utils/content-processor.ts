// @ts-ignore - linkedom types may not be available
import { parseHTML } from 'linkedom'

export function processPostContent(html: string) {
  const { document } = parseHTML(html)

  // Transform YouTube iframes to your custom component
  document.querySelectorAll('iframe').forEach((iframe: any) => {
    const src = iframe.getAttribute('src')
    if (src?.includes('youtube.com') || src?.includes('youtu.be')) {
      const videoId = extractYouTubeId(src)
      iframe.outerHTML = `<YouTubeEmbed id="${videoId}" />`
    }
  })

  // Remap image sources
  document.querySelectorAll('img').forEach((img: any) => {
    const src = img.getAttribute('src')
    if (src?.startsWith('/wp-content/uploads/')) {
      img.setAttribute('src', src.replace('/wp-content/uploads/', '/images/blog/'))
    }
  })

  // Wrap images in figure with caption
  document.querySelectorAll('img').forEach((img: any) => {
    const alt = img.getAttribute('alt')
    const wrapper = document.createElement('figure')
    wrapper.className = 'blog-image'
    img.parentNode?.insertBefore(wrapper, img)
    wrapper.appendChild(img)
    if (alt) {
      const caption = document.createElement('figcaption')
      caption.textContent = alt
      wrapper.appendChild(caption)
    }
  })

  return document.toString()
}

function extractYouTubeId(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match?.[1] || ''
}
