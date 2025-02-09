import pandas as pd
from datetime import datetime
import logging

class OpenApiDataProcessor:
    def __init__(self, open_api_url: str, batch_size: int = 1000):
        """
        Initialize the OpenApiDataPorcessor with NYC Open Data URL and configuration.
        
        Args:
            open_api_url:   The Open API URL from which to retrieve data
            batch_size:     The number of records to retrieve in each API call. Defaults to 1000
        """
        self.open_api_url = open_api_url
        self.batch_size = batch_size
        
        if open_api_url[len(open_api_url)-3:] == 'csv':
            self.mode = 'csv'
        elif open_api_url[len(open_api_url)-4:] == 'json':
            self.mode = 'json'
        else:
            print(f"Unrecognized URL format: {open_api_url}. Failed to create OpenApiDataProcessor.")
            return None
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def get_data(self) -> pd.DataFrame:
        """Collect all available data from the provided NYC Open API URL.
        Compatible with CSV and JSON endpoints."""

        df = pd.DataFrame()
        offset = 0
        more_data = True

        while(more_data):
            url_to_call = self.open_api_url + "?$order=:id&$offset=" + str(offset)
            url_to_call = url_to_call.replace(" ", "%20")
            
            print(f"Retrieving data from {url_to_call}")

            match self.mode:
                case 'csv':
                    next_data = pd.read_csv(url_to_call)
                case 'json':
                    next_data = pd.read_json(url_to_call)

            if not next_data.empty:
                print(f"Collecting from row {offset}")
                df = pd.concat([df, next_data])
                offset += self.batch_size
                print(f"Collected {self.batch_size} rows.")
            else:
                more_data = False
                print("No more data available.")

        print(f"Collected all available data from {self.open_api_url}")
        return df

    def get_data_by_date(self, start_date, end_date = datetime.utcnow().isoformat()) -> pd.DataFrame:
        """Collect all available data from the provided NYC Open API URL,
        since the specified date."""

        df = pd.DataFrame()
        offset = 0
        more_data = True

        while(more_data):
            url_to_call = self.open_api_url + "?$order=:id&$offset=" + str(offset) + "&$where=domain_registration_date BETWEEN '" + str(start_date) + "' AND '" + str(end_date) + "'"
            url_to_call = url_to_call.replace(" ", "%20")

            print(f"Retrieving data from {url_to_call}")

            match self.mode:
                case 'csv':
                    next_data = pd.read_csv(url_to_call)
                case 'json':
                    next_data = pd.read_json(url_to_call)

            if not next_data.empty:
                print(f"Collecting from row {offset}")
                df = pd.concat([df, next_data])
                offset += self.batch_size
                print(f"Collected {self.batch_size} rows.")
            else:
                more_data = False
                print("No more data available.")

        print(f"Collected all available data from {self.open_api_url}")
        return df