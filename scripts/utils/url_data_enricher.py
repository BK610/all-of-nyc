import requests
import pandas as pd
from utils.populate_metadata import ensure_valid_protocol, parse_open_graph_metadata
from utils.open_api_data_processor import get_open_api_data_from_url
from utils.csv_processing import append_row_to_csv, append_rows_to_csv
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import os
import aiohttp
import asyncio
import logging


class UrlDataEnricher:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

        self.session = self.setup_session()
        self.CSV_ROWS_SCHEMA = [
            'domain_name',
            'domain_registration_date',
            'nexus_category',
            'status_code',
            'final_url',
            'title',
            'description',
            'image'
        ]

    def setup_session(self):
        """Create a requests Session to be used for all synchronous requests, with desired configuration.
        Cleaner than creating a new request and configuring the settings every time."""
        session = requests.Session()

        # Disable SSL verification for the session to improve redirect handling
        # Not a great idea, but doing it for now
        session.verify = False

        # Suppress the InsecureRequestWarning from urllib3
        # (otherwise, there would be an extra error for every row in the file) 
        requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

        return session

    def read_csv_data(self, file_path):
        """Read the provided CSV file into a pandas.DataFrame."""

        # TODO: Find a better way to identify if the provided path is a URL.
        if file_path.startswith("http"):
            return get_open_api_data_from_url(file_path)
        else:
            existing_data = None

            try:
                file_exists = os.path.isfile(file_path)

                if file_exists:
                    existing_data = pd.read_csv(file_path)
                else:
                    existing_data = pd.DataFrame(columns=self.CSV_ROWS_SCHEMA)
            except FileNotFoundError:
                existing_data = pd.DataFrame(columns=self.CSV_ROWS_SCHEMA)
            
            return existing_data

    def get_response(self, url, session):
        """Get the response at the provided url using the provided requests.Session.
        Attempts using both HTTPS and HTTP protocols to Handle SSL issues."""
        url = ensure_valid_protocol(url)

        try:
            # Try with HTTPS
            response = session.get(url, timeout=5)
            return response
        except requests.exceptions.SSLError:
            print(f"SSL error with {url}, trying HTTP instead.")
            # Try with HTTP if HTTPS fails
            url = url.replace("https://", "http://")
            try:
                response = session.get(url, timeout=5)
                return response
            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")
                return None
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
        
    async def get_response_async(self, url, session):
        """Get the response at the provided url using the provided aiohttp.ClientSession.
        Attempts using both HTTPS and HTTP protocols to Handle SSL issues."""
        # TODO: Can get_response and get_response_async be combined?
        # Almost the entire function is the same, but the async processing
        # works differently.
        url = ensure_valid_protocol(url)

        try:
            # Try with HTTPS
            async with session.get(url, timeout=10) as response:
                response_text = await response.text()
                return response, response_text
        except requests.exceptions.SSLError:
            print(f"SSL error with {url}, trying HTTP instead.")
            # Try with HTTP if HTTPS fails
            url = url.replace("https://", "http://")
            try:
                async with session.get(url, timeout=10) as response:
                    response_text = await response.text()
                    return response, response_text
            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")
                return None
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None

    # Synchronous versions of the URL enriching functions

    def enrich_url(self, url, registration_date, nexus_category, session):
        """Process an individual URL to get status code and Open Graph data."""
        status_code = "Error"
        final_url = "Error"
        open_graph_metadata = {
            'title': "Error",
            'description': "Error",
            'image': "Error"
        }
        
        response = self.get_response(url, session)

        if response:
            status_code = response.status_code
            final_url = response.url
            open_graph_metadata = parse_open_graph_metadata(response.content)

        return {
            # Original data
            'domain_name': url,
            'domain_registration_date': registration_date,
            'nexus_category': nexus_category,
            # Status code from pinging URL
            'status_code': status_code,
            # Final URL that the original URL directed to
            'final_url': final_url,
            # Metadata available at final URL
            'title': open_graph_metadata['title'],
            'description': open_graph_metadata['description'],
            'image': open_graph_metadata['image']
        }

    def enrich_urls(self, input_csv_path, output_csv_path):
        """Read URLs from CSV, process them, and save enriched data to a new CSV file."""
        try:
            existing_enriched_data = self.read_csv_data(output_csv_path)

            # Collect the list of URLs that have already been processed into the output file
            processed_urls = set(existing_enriched_data['domain_name'])
            
            input_data = self.read_csv_data(input_csv_path)

            if 'domain_name' not in input_data.columns:
                print("CSV must contain a 'domain_name' column")
                return

            # Iterate through rows, enrich the data, append to the output CSV
            for index, row in input_data.iterrows():
                if row['domain_name'] in processed_urls:
                    continue # Skip URLs that we've already processed

                enriched_row = self.enrich_url(row['domain_name'], row['domain_registration_date'], row['nexus_category'], self.session)
                append_row_to_csv(enriched_row, output_csv_path)
                print(f"Finished processing: {row['domain_name']}")
            
            print(f"Finished processing all of: {input_csv_path}")

        except Exception as e:
            print(f"Error during processing: {e}")

    # Asynchronous versions of the URL enriching functions

    async def enrich_url_async(self, url, registration_date, nexus_category, session, semaphore):
        """Enrich one URL with HTTP status code and available Open Graph data.
        Performed asynchronously using aiohttp, asyncio, and asyncio.Semaphore."""

        status_code = "Error"
        final_url = "Error"
        open_graph_metadata = {
            'title': "Error",
            'description': "Error",
            'image': "Error"
        }

        async with semaphore:
            try:
                response, response_text = await self.get_response_async(url, session)
                if response:
                    status_code = response.status
                    final_url = response.url
                    open_graph_metadata = parse_open_graph_metadata(response_text)
            except Exception as e:
                print(f"Error processing URL {url}: {e}")
            
            print(f"Finished processing: {url}")

            return {
                # Original data
                'domain_name': url,
                'domain_registration_date': registration_date,
                'nexus_category': nexus_category,
                # Status code from pinging URL
                'status_code': status_code,
                # Final URL that the original URL directed to
                'final_url': final_url,
                # Metadata available at final URL
                'title': open_graph_metadata['title'],
                'description': open_graph_metadata['description'],
                'image': open_graph_metadata['image']
            }

    async def process_urls(self, input_data, session, processed_urls, output_csv_path):
        """TODO: Write docstring when I figure out why this is a separate function."""

        # Limit the number of async threads to manage network bandwidth and machine resources.
        # TODO: Play around to find the right balance of processing speed and receiving valid responses
        sem = asyncio.Semaphore(5)

        async_url_tasks = [
            self.enrich_url_async(row['domain_name'], row['domain_registration_date'], row['nexus_category'], session, sem)
            for index, row in input_data.iterrows()
            if row['domain_name'] not in processed_urls
        ]

        async for task in asyncio.as_completed(async_url_tasks):
            enriched_row = await task
            if enriched_row:
                append_row_to_csv(enriched_row, output_csv_path)

    async def enrich_urls_async(self, input_csv_path, output_csv_path):
        """Enrich all urls in CSV at input_csv_path with HTTP status code and available Open Graph data.
        Output to CSV at output_csv_path.
        Performed asynchronously using aiohttp, asyncio, and asyncio.Semaphore."""
        
        try:
            existing_enriched_data = self.read_csv_data(output_csv_path)
            processed_urls = set(existing_enriched_data['domain_name'])
            input_data = self.read_csv_data(input_csv_path)

            if 'domain_name' not in input_data.columns:
                print("CSV must contain a 'domain_name' column")
                return
            
            # Limit the number of concurrent connections to manage network bandwidth and machine resources.
            # TODO: Play around to find the right balance of processing speed and receiving valid responses
            conn = aiohttp.TCPConnector(limit=5)

            async with aiohttp.ClientSession(connector=conn) as session:
                await self.process_urls(
                    input_data,
                    session,
                    processed_urls,
                    output_csv_path,
                )
            
            print(f'Finished processing all URLs in {input_csv_path}')
        except FileNotFoundError:
            print(f"File not found at {input_csv_path}: {e}")
        except Exception as e:
            print(f"Error during processing: {e}")