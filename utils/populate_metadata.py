import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urlparse

def ensure_protocol(url):
    """Ensure the URL starts with 'http://' or 'https://'."""
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url

def get_status_code(url):
    """Fetch the HTTP status code for a given URL."""
    try:
        # Try with https
        response = requests.head(url, timeout=5)
        return response.status_code
    except requests.exceptions.SSLError:
        print(f"SSL error with {url}, trying http instead.")
        # Try with http if https fails
        url = url.replace("https://", "http://")
        try:
            response  = requests.head(url, timeout=10)
            return response.status_code
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_meta_data(url):
    """Fetch metadata (title, description, and image) for a URL."""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            return None, None, None

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
        title = soup.title.string if soup.title else 'None'
        description = soup.find('meta', attrs={'name': 'description'})

        print(f"og_title: {og_title['content'] if og_title else twitter_title['content'] if twitter_title else title}")

        return {
            'title': og_title['content'] if og_title else twitter_title['content'] if twitter_title else title,
            'description': og_description['content'] if og_description else twitter_description['content'] if twitter_description else (description['content'] if description else 'None'),
            'image': og_image['content'] if og_image else twitter_image['content'] if twitter_image else 'None'
        }
    except requests.RequestException as e:
        print(f"Error fetching metadata for {url}: {e}")
        return {
            'title': "Error",
            'description': "Error",
            'image': "Error",
        }

def enrich_url(url, registration_date):
    """Process an individual URL to get status code and Open Graph data."""
    url = ensure_protocol(url)

    # Fetch HTTP status code
    status_code = get_status_code(url)

    # Fetch Open Graph metadata
    metadata = get_meta_data(url)

    return {
        'url': url,
        'registration_date': registration_date,
        'status_code': status_code,
        'title': metadata['title'],
        'description': metadata['description'],
        'image': metadata['image']
    }

def enrich_urls(csv_path, output_path):
    """Read URLs from CSV, process them, and save enriched data to a new CSV file."""
    # Read URLs from CSV
    df = pd.read_csv(csv_path)
    if 'url' not in df.columns:
        print("CSV must contain a 'url' column")
        return

    enriched_data = []

    for index, row in df.iterrows():
        result = enrich_url(row['url'], row['registration_date'])
        enriched_data.append(result)

    # Convert enriched data to DataFrame and save it
    enriched_df = pd.DataFrame(enriched_data)
    enriched_df.to_csv(output_path, sep=",", index=False)
    print(f"Enriched data saved to {output_path}")

# Test usage
test_csv_path = 'test_file.csv' # Sample of ~100 rows from the real data
test_output_path = 'test_output_file.csv' # Path to save enriched test data

# Real file usage
real_csv_path = 'nyc_Domain_Registrations_20241115.csv'  # Path to your input CSV file
real_output_path = 'output_urls_enriched.csv'  # Path to save enriched CSV file

# enrich_url("https://apple.com")

enrich_urls(test_csv_path, test_output_path)