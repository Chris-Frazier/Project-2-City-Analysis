import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################

# Create Engine
engine = create_engine("sqlite:///cities_db.sqlite")

# reflect an existing database into a new model
Base = automap_base() # AUTO MAP OR DECLARATIVE?

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to table 'cities'
Cities = Base.classes.cities

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    cities = Cities
    return render_template("home.html", cities = cities)

@app.route("/info")
def info():
    cities = Cities
    return render_template("info.html", cities = cities)

# create Map 
@app.route("/map")
def map():
    engine = create_engine("sqlite:///cities_db.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)
    cities = Cities
    return render_template("map.html", cities = cities)

# Scatter Plot
@app.route("/scatter")
def population():
    engine = create_engine("sqlite:///cities_db.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)
    cities = Cities

    return render_template("scatter.html", cities = cities)


#create metadata route to pull data clientside RESTful API
@app.route("/metadata")
def city_metadata():
    engine = create_engine("sqlite:///cities_db.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)

    """Return all data for a city."""
    sel = [
        Cities.city,
        Cities.state,
        Cities.lat,
        Cities.lng,
        Cities.pop_2016,
        Cities.estab_2016,
        Cities.median_household_inc,
        Cities.bach_or_higher_percent,
        Cities.agg_commute_mins,
        Cities.biz_growth_Y,
        Cities.tax_rank,
        Cities.corp_tax_rank,
        Cities.income_tax_rank,
        Cities.sales_tax_rank,
        Cities.property_tax_rank,
        Cities.unemployment_tax_rank,
        Cities.city_state
    ]

    # results = session.query(*sel).order_by(Cities.population.desc()).limit(100).all()
    results = session.query(*sel).all()

    # Create a dictionary entry for each city's information
    meta_dict = {}
    meta_list = []

    # Formatting data to mirror GeoJSON
    for result in results:
        city_metadata_dict = {}
        city_metadata_dict["city"] = result[0]
        city_metadata_dict["state"] = result[1]
        city_metadata_dict["coordinates"] = [result[2], result[3]]
        city_metadata_dict["population_2016"] = result[4]
        city_metadata_dict["estab_2016"] = result[5]
        city_metadata_dict["median_household_inc"] = result[6]
        city_metadata_dict["bach_or_higher_percent"] = result[7]
        city_metadata_dict["agg_commute_mins"] = result[8]
        city_metadata_dict["biz_growth_Y"] = result[9]
        city_metadata_dict["tax_rank"] = result[10]
        city_metadata_dict["corp_tax_rank"] = result[11]
        city_metadata_dict["income_tax_rank"] = result[12]
        city_metadata_dict["sales_tax_rank"] = result[13]
        city_metadata_dict["property_tax_rank"] = result[14]
        city_metadata_dict["unemployment_tax_rank"] = result[15]
        city_metadata_dict["city_state"] = result[16]
        
    #INSERT ADDITIONAL VARS HERE 
        meta_list.append(city_metadata_dict)
        #ALLOWS ACCES TO ALL DATA BY DICT.KEY FOR MAPPING LEAFLET
    meta_dict = {"keys": meta_list}
    return jsonify(meta_dict)

if __name__ == "__main__":
    app.run(debug=True)