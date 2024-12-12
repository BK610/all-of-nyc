import requests
import pandas as pd
from populate_metadata import ensure_protocol, get_status_code, get_meta_data, get_meta_data_v2
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import os
import aiohttp
import asyncio
import argparse
import time

CSV_ROWS_SCHEMA = [
    'url',
    'registration_date',
    'nexus_category',
    'status_code',
    'final_url',
    'title',
    'description',
    'image'
    ]

def setup_session():
    session = requests.Session()

    # Disable SSL verification for the session to improve redirect handling
    # Not a great idea, but doing it for now
    session.verify = False

    # Suppress the InsecureRequestWarning from urllib3
    # (otherwise, there would be an extra error for every row in the file) 
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

    return session

def append_to_csv(row, file_path, file_exists):
    pd.DataFrame([row]).to_csv(
        file_path,
        mode='a',
        sep=",",
        header=not file_exists, # Write header only if file doesn't exist
        index=False
    )

def enrich_url(url, registration_date, session):
    """Process an individual URL to get status code and Open Graph data."""
    # Ensure url starts with https or http protocol
    url_with_protocol = ensure_protocol(url)

    # Fetch HTTP status code
    status_code = get_status_code(url_with_protocol, session)

    # Fetch Open Graph metadata
    metadata = get_meta_data(url_with_protocol, session)

    return {
        # Original data
        'url': url,
        'registration_date': registration_date,
        # Status code from pinging URL
        'status_code': status_code,
        # Metadata from URL, or redirected URL
        'final_url': metadata['final_url'],
        'title': metadata['title'],
        'description': metadata['description'],
        'image': metadata['image']
    }

def enrich_urls(input_csv_path, output_csv_path):
    """Read URLs from CSV, process them, and save enriched data to a new CSV file."""
    try:
        # Check if output CSV exists
        file_exists = os.path.isfile(output_csv_path)

        # Load existing data if output CSV exists, otherwise create new DataFrame
        try:
            if file_exists:
                existing_data = pd.read_csv(output_csv_path)
            else:
                existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
        except FileNotFoundError:
            existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)

        # Collect the list of URLs that have already been processed into the output file
        processed_urls = set(existing_data['url'])
        
        # Read URLs from CSV
        input_data = pd.read_csv(input_csv_path)

        # Check that `url` column exists
        if 'url' not in input_data.columns:
            print("CSV must contain a 'url' column")
            return
        
        # Create new requests.Session() with desired settings
        session = setup_session()

        # Get the info for each URL and add it to the array that's being built
        for index, row in input_data.iterrows():
            if row['url'] in processed_urls:
                continue # Skip URLs that we've already processed

            enriched_row = enrich_url(row['url'], row['registration_date'], session)

            # Convert enriched data to DataFrame and save it
            # print(enriched_row)
            pd.DataFrame([enriched_row]).to_csv(
                output_csv_path,
                mode='a',
                sep=",",
                header=not file_exists, # Write header only if file doesn't exist
                index=False
            )
            print(f"Finished processing: {row['url']}")
            file_exists = True  # Set to True after first write if file was created
        
        print(f"Finished processing all of: {input_csv_path}")

    except Exception as e:
        print(f"Error during processing: {e}")

async def process_urls(input_data, session, processed_urls, output_csv_path, file_exists):
    sem = asyncio.Semaphore(5)

    tasks_test = [
        enrich_url_async(row['url'], row['registration_date'], row['nexus_category'], session, sem)
        for index, row in input_data.iterrows()
        if row['url'] not in processed_urls
    ]

    async for task in asyncio.as_completed(tasks_test):
        result = await task
        if result:
            append_to_csv(result, output_csv_path, file_exists)
            file_exists = True

async def enrich_url_async(url, registration_date, nexus_category, session, semaphore):
    
    # Ensure url starts with https protocol
    url_with_protocol = ensure_protocol(url)

    status_code = "Error"
    final_url = "Error"
    metadata = {
        'title': "Error",
        'description': "Error",
        'image': "Error"
    }

    async with semaphore:
        # Try with https
        try:
            async with session.get(url_with_protocol, timeout=5) as response:
                response_text = await response.text()
                status_code = response.status
                final_url = response.url
                metadata = get_meta_data_v2(url, response_text)

        # Try with http if https fails
        except requests.exceptions.SSLError:
            print(f"SSL error with {url}, trying http connection.")
            url = url.replace("https://", "http://")
            try:
                async with session.get(url_with_protocol, timeout=5) as response:
                    response_text = await response.text()
                    status_code = response.status
                    final_url = response.url
                    metadata = get_meta_data_v2(url, response_text)
                    
            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
        except Exception as e:
            print(f"Error processing URL {url}: {e}")

        print(f"Finished processing: {url}")

        return {
            # Original data
            'url': url,
            'registration_date': registration_date,
            'nexus_category': nexus_category,
            # Status code from pinging URL
            'status_code': status_code,
            # Metadata from URL, or redirected URL
            'final_url': final_url,
            'title': metadata['title'],
            'description': metadata['description'],
            'image': metadata['image']
        }

async def enrich_urls_async(input_csv_path, output_csv_path):

    # Load existing data if output CSV exists, otherwise create new DataFrame
    try:
        file_exists = os.path.isfile(output_csv_path)

        if file_exists:
            existing_data = pd.read_csv(output_csv_path)
        else:
            existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
    except FileNotFoundError:
        existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
        
    try:
        processed_urls = set(existing_data['url'])
        input_data = pd.read_csv(input_csv_path)

        if 'url' not in input_data.columns:
            print("CSV must contain a 'url' column")
            return
        
        conn = aiohttp.TCPConnector(limit=5)

        async with aiohttp.ClientSession(connector=conn) as session:
            await process_urls(
                input_data,
                session,
                processed_urls,
                output_csv_path,
                file_exists
            )
        
        print(f'Finished processing all URLs in {input_csv_path}')

    except Exception as e:
        print(f"Error during processing: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='EnrichUrls',
        description='Enrich a set of URLs from an input CSV file with HTTP status code and OpenGraph info available at the URL.'
    )

    parser.add_argument('input_csv_path', help='Path to input CSV.')
    parser.add_argument('output_csv_path', help='Path to output CSV.')
    parser.add_argument('-a', '--asynchronous', action='store_true', help='Run in asynchronous mode. Default False.')

    args = parser.parse_args()

    start_time = time.perf_counter()
    if args.asynchronous:
        asyncio.run(enrich_urls_async(args.input_csv_path, args.output_csv_path))
    else:
        enrich_urls(args.input_csv_path, args.output_csv_path)
    
    end_time = time.perf_counter()

    print(f"Time taken: {end_time - start_time}")