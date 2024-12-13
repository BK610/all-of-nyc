import pandas as pd

def get_open_api_data_from_url(api_url):
    """Collect all available data from the provided NYC Open API URL.
       Compatible with CSV and JSON endpoints."""

    api_url = "https://data.cityofnewyork.us/resource/9cw8-7heb.csv"

    mode = None

    if api_url[len(api_url)-3:] == 'csv':
        mode = 'csv'
    elif api_url[len(api_url)-4:] == 'json':
        mode = 'json'
    else:
        print(f"Unrecognized URL format: {api_url}")
        return None

    df = pd.DataFrame()
    offset = 0
    more_data = True

    print(f"Collecting data from: {api_url}")

    # TODO: Stop the loop when there's no more data available
    while(more_data):
        url_to_call = api_url + "?$order=:id&$offset=" + str(offset)

        match mode:
            case 'csv':
                next_data = pd.read_csv(url_to_call)
            case 'json':
                next_data = pd.read_json(url_to_call)

        if not next_data.empty:
            df = pd.concat([df, next_data])
            offset += 1000
            print(f"Collected {1000} rows.")
        else:
            more_data = False
            print("No more data available.")

    print(f"Collected all available data from {api_url}")
    return df