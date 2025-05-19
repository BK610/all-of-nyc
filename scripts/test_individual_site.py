from utils.url_data_enricher import UrlDataEnricher
import argparse

def main():
    parser = argparse.ArgumentParser(
        description='Test metadata scraping for a single .nyc domain'
    )
    parser.add_argument('url', help='The .nyc domain to test (e.g., example.nyc)')

    args = parser.parse_args()
    
    # Initialize the URL data enricher
    enricher = UrlDataEnricher()
    
    # Enrich the URL
    result = enricher.enrich_url(args.url, "2025-05-19T00:00:00", "INDIV")
    
    # Print the results in a readable format
    print("\nResults for", args.url)
    print("-" * 50)
    print(f"Status Code: {result['status_code']}")
    print(f"Final URL: {result['final_url']}")
    print("\nMetadata:")
    print(f"Title: {result['title']}")
    print(f"Description: {result['description']}")
    print(f"Image URL: {result['image']}")
    print("\nStatus:")
    print(f"URL Found: {result['is_url_found']}")
    print(f"Title Found: {result['is_og_title_found']}")
    print(f"Image Found: {result['is_og_image_found']}")
    print(f"Website Status: {result['website_status']}")

if __name__ == "__main__":
    main()
    