from bs4 import BeautifulSoup

def ensure_protocol(url):
    """Ensure the URL starts with 'http://' or 'https://'."""
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url
    
def parse_open_graph_metadata(webpage_content):
    """Parse Open Graph metadata from the provided webpage_content."""
    try:
        soup = BeautifulSoup(webpage_content, 'html.parser')

        # Open Graph metadata
        og_title = soup.find('meta', property='og:title')
        og_description = soup.find('meta', property='og:description')
        og_image = soup.find('meta', property='og:image')

        # Twitter metadata
        twitter_title = soup.find('meta', attrs={'name': 'twitter:title'})
        twitter_description = soup.find('meta', attrs={'name': 'twitter:description'})
        twitter_image = soup.find('meta', attrs={'name': 'twitter:image'})

        # Standard metadata
        title = soup.title.string if soup.title else 'Not found'
        description = soup.find('meta', attrs={'name': 'description'})

        # Helper function to safely extract content
        def get_content(tag):
            return tag['content'] if tag and tag.has_attr('content') else None

        return {
            'title': get_content(og_title) or get_content(twitter_title) or title,
            'description': get_content(og_description) or get_content(twitter_description) or (get_content(description) if description else 'Not found'),
            'image': get_content(og_image) or get_content(twitter_image) or 'Not found'
        }
    except Exception as e:
        print(f"Error extracting Open Graph data: {e}")
        return {
                'title': 'Error',
                'description': 'Error',
                'image': 'Error',
            }