export function embedYoutubeVideos(document: any): void {
  document.querySelectorAll(".wp-block-embed-youtube").forEach((figure: any) => {
    const url = figure.textContent?.trim();
    const videoId = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    )?.[1];
    if (!videoId) return;

    const placeholder = document.createElement("div");
    placeholder.innerHTML = `<iframe
          width="100%"
          height="315"
          src="https://www.youtube-nocookie.com/embed/${videoId}?controls=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
      ></iframe>`;
    figure.replaceWith(placeholder);
  });
}
