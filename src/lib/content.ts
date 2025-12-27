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

export function embedTedVideos(document: any): void {
  document.querySelectorAll(".wp-block-embed-ted").forEach((figure: any) => {
    const url = figure.textContent?.trim();
    const slug = url?.match(/https:\/\/www\.ted\.com\/talks\/(.+)/)?.[1];
    if (!slug) return;

    const placeholder = document.createElement("div");
    placeholder.style.maxWidth = "1024px";
    placeholder.innerHTML = `<div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://embed.ted.com/talks/${slug}" width="1024px" height="576px" title="TED Talk" style="position:absolute;left:0;top:0;width:100%;height:100%" frameborder="0" scrolling="no" allowfullscreen></iframe></div>`;
    figure.replaceWith(placeholder);
  });
}
