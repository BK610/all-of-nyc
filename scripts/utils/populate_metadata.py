from bs4 import BeautifulSoup

def ensure_valid_protocol(url: str) -> str:
    """Ensure the URL starts with 'http://' or 'https://'."""
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url

def ensure_absolute_url(base_url: str, path: str) -> str:
    """Convert a relative path to an absolute URL using the base URL."""
    if not path:
        return 'Not found'
    if path.startswith(('http://', 'https://')):
        return path
    # Remove any leading slashes from the path
    path = path.lstrip('/')
    # Remove any trailing slashes from the base URL
    base_url = base_url.rstrip('/')
    return f"{base_url}/{path}"

def parse_open_graph_metadata(webpage_content, base_url: str = None):
    """Parse Open Graph metadata from the provided webpage_content."""
    try:
        # Use lxml parser for better HTML5 support
        soup = BeautifulSoup(webpage_content, 'lxml')

        # Helper function to safely extract content with multiple possible attribute names
        def get_meta_content(tag):
            if not tag:
                return None
            # Check for content attribute
            if tag.has_attr('content'):
                return tag['content']
            # Check for value attribute (some sites use this)
            if tag.has_attr('value'):
                return tag['value']
            return None

        # Helper function to find meta tags with multiple possible attribute formats
        def find_meta_tag(property_name, name_name=None):
            # Try OpenGraph format
            tag = soup.find('meta', property=property_name)
            if tag:
                return tag
            # Try name attribute format
            if name_name:
                tag = soup.find('meta', attrs={'name': name_name})
                if tag:
                    return tag
            # Try case-insensitive search
            for tag in soup.find_all('meta'):
                if tag.has_attr('property') and tag['property'].lower() == property_name.lower():
                    return tag
                if name_name and tag.has_attr('name') and tag['name'].lower() == name_name.lower():
                    return tag
            return None

        # Get title from various sources
        og_title = find_meta_tag('og:title', 'twitter:title')
        title = get_meta_content(og_title)
        if not title:
            # Try standard title tag
            title_tag = soup.find('title')
            title = title_tag.string if title_tag else None
            # Clean up title if found
            if title:
                title = title.strip()

        # Get description from various sources
        og_description = find_meta_tag('og:description', 'twitter:description')
        description = get_meta_content(og_description)
        if not description:
            # Try standard meta description
            meta_description = soup.find('meta', attrs={'name': 'description'})
            description = get_meta_content(meta_description)

        # Get image from various sources
        og_image = find_meta_tag('og:image', 'twitter:image')
        image = get_meta_content(og_image)
        if not image:
            # Try to find any image in the page
            img_tag = soup.find('img')
            if img_tag and img_tag.has_attr('src'):
                image = img_tag['src']
        
        # Ensure image URL is absolute if base_url is provided
        if base_url and image != 'Not found':
            image = ensure_absolute_url(base_url, image)

        # Clean up the data
        def clean_text(text):
            if not text:
                return 'Not found'
            # Remove extra whitespace and normalize spaces
            text = ' '.join(text.split())
            # Decode HTML entities
            text = BeautifulSoup(text, 'lxml').get_text()
            return text

        return {
            'title': clean_text(title),
            'description': clean_text(description),
            'image': image if image else 'Not found'
        }
    except Exception as e:
        print(f"Error extracting Open Graph data: {e}")
        return {
            'title': 'Error',
            'description': 'Error',
            'image': 'Error',
        }