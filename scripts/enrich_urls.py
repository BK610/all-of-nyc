from utils.url_data_enricher import UrlDataEnricher
import asyncio
import argparse
import time

test_csv = [
        {
            "domain_name": "coolstuff.nyc",
            "domain_registration_date": "2025-02-10T00:00:00",
            "nexus_category": "INDIV"
        }
    ]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='EnrichUrls',
        description='Enrich a set of URLs from an input CSV file with HTTP status code and OpenGraph info available at the URL.'
    )

    parser.add_argument('input_csv_path', help='Path to input CSV.')
    parser.add_argument('output_csv_path', help='Path to output CSV.')
    parser.add_argument('-a', '--asynchronous', action='store_true', help='Run in asynchronous mode. Default False.')

    args = parser.parse_args()

    url_data_enricher = UrlDataEnricher()

    start_time = time.perf_counter()
    if args.asynchronous:
        asyncio.run(url_data_enricher.enrich_urls_async(args.input_csv_path, args.output_csv_path))
    else:
        # url_data_enricher.enrich_urls(args.input_csv_path, args.output_csv_path)
        url_data_enricher.enrich_urls(test_csv, args.output_csv_path)
    
    end_time = time.perf_counter()

    print(f"Time taken: {end_time - start_time}")