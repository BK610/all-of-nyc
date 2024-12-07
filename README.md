# Feedback from Adam

- [ ] Add a link to the project in the README (I know it's in the "about" section, but it's good to have a CTA in the README too)

# What's up with `.nyc`

All websites have a top-level domain (TLD) that is used to indicate the purpose of the website. For example, `.com`, `.org`, `.sucks`, `.io`, and many others.

The `.nyc` TLD is a bit of an outlier. There are only [a handful of TLDs](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Geographic_top-level_domains) that are used to indicate a specific geographic area that's _not_ an entire country. Said another way, most cities or geographic areas don't have their own TLD. While it's easy for internet users to navigate, it's certainly not common practice for websites to use a geographically-focused TLD like `.nyc`.

That said, I was curious exactly how `.nyc` has been used since its introduction as a generally-available TLD in 2014. Thankfully, [NYC OpenData maintains an open data source for `.nyc` Domain Registrations](https://data.cityofnewyork.us/Business/-nyc-Domain-Registrations/9cw8-7heb/about_data) that can be used to understand the history and use of `.nyc` domains.

This project is exploratory, without a particular hypothesis in mind. I'm aiming to understand and visualize `.nyc` TLD usage over time, and connect it to real-world events and trends when possible.

### See [Results.ipynb](https://github.com/BK610/all-of-nyc/blob/main/jupyter/Results.ipynb) for more information.

## Built with

- [NYC Open Data](https://data.cityofnewyork.us/Business/-nyc-Domain-Registrations/9cw8-7heb/about_data) - Official source for `.nyc` data, and 3000+ other data sets.
- [Jupyter Notebook](https://jupyter.org/) - "The Jupyter Notebook is the original web application for creating and sharing computational documents. It offers a simple, streamlined, document-centric experience."
- [Python](https://www.python.org/) - Programming language used for enriching and processing the data.
- [Next.js](https://nextjs.org/) - React framework used for building the web app.
