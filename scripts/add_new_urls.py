# uses current package visibility
from utils.get_open_api_data import OpenApiDataProcessor

if __name__ == "__main__":
    processor = OpenApiDataProcessor("https://data.cityofnewyork.us/resource/9cw8-7heb.csv", 100)
    start_date = "2025-02-08T00:00:00"

    data = processor.get_data_by_date(start_date)

    print(data)