import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import aiohttp
import asyncio

def ensure_protocol(url):
    """Ensure the URL starts with 'http://' or 'https://'."""
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url

def get_status_code(url, session):
    """Fetch the HTTP status code for a given URL."""
    try:
        # Try with https
        response = session.head(url, timeout=5)
        return response.status_code
    except requests.exceptions.SSLError:
        print(f"SSL error with {url}, trying http instead.")
        # Try with http if https fails
        url = url.replace("https://", "http://")
        try:
            response  = session.head(url, timeout=5)
            return response.status_code
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_meta_data(url, session):
    """Fetch metadata (title, description, and image) for a URL."""
    try:
        response = session.get(url, timeout=5)
        response.raise_for_status() # Built-in function to ensure status code is 200

        # Get the final redirected URL
        final_url = response.url

        soup = BeautifulSoup(response.content, 'html.parser')

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
            'url': url,
            'final_url': final_url,
            'title': get_content(og_title) or get_content(twitter_title) or title,
            'description': get_content(og_description) or get_content(twitter_description) or (get_content(description) if description else 'Not found'),
            'image': get_content(og_image) or get_content(twitter_image) or 'Not found'
        }
    except requests.RequestException as e:
        print(f"Error fetching metadata for {url}: {e}")
    except Exception as e:
        print(f"Unexpected error for {url}: {e}")
    # If we encountered an exception, return original url value and Error
    return {
            'url': url,
            'final_url': "Error",
            'title': "Error",
            'description': "Error",
            'image': "Error",
        }

async def get_status_code_async(url, session):
    """Fetch the HTTP status code for a given URL."""
    try:
        # Try with https
        async with session.head(url, timeout=5) as response:
            return response.status
    except requests.exceptions.SSLError:
        print(f"SSL error with {url}, trying http instead.")
        # Try with http if https fails
        url = url.replace("https://", "http://")
        try:
            async with session.head(url, timeout=5) as response:
                return response.status
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return "Error"
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return "Error"
    
async def get_meta_data_async(url, session):
    try:
        async with session.get(url, timeout=5) as response:
            # response.raise_for_status() # Built-in function to ensure status code is 200

            # Get the final redirected URL
            final_url = response.url

            soup = BeautifulSoup(await response.text(), 'html.parser')

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
                'final_url': final_url,
                'title': get_content(og_title) or get_content(twitter_title) or title,
                'description': get_content(og_description) or get_content(twitter_description) or (get_content(description) if description else 'Not found'),
                'image': get_content(og_image) or get_content(twitter_image) or 'Not found'
            }
    except requests.RequestException as e:
        print(f"Error fetching metadata for {url}: {e}")
    except Exception as e:
        print(f"Unexpected error for {url}: {e}")
    # If we encountered an exception, return original url value and Error
    return {
            'final_url': "Error",
            'title': "Error",
            'description': "Error",
            'image': "Error",
        }