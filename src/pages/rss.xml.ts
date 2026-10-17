import rss from '@astrojs/rss';
import { site } from '../site';
import { publishedPosts, postUrl } from '../lib/posts';

export async function GET() {
  return rss({
    title: site.title, description: site.description, site: site.url,
    items: (await publishedPosts()).map(post => ({
      title: post.data.title, description: post.data.description,
      pubDate: post.data.date, link: postUrl(post.id), categories: post.data.tags,
    })),
    customData: '<language>ko</language>',
  });
}
