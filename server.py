from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

NASA_API = "https://api.nasa.gov/neo/rest/v1/neo/browse"
API_KEY = "dZUjhew344GNhkQhdizdUBQCNv1XOhHqY2cZ6JNW"  # replace with your own key if you have it

@app.route('/asteroids')
def get_asteroids():
    response = requests.get(f"{NASA_API}?api_key={API_KEY}")
    data = response.json()
    asteroids = []

    for neo in data['near_earth_objects'][:5]:  # first 5 asteroids only
        asteroids.append({
            'name': neo['name'],
            'diameter': round(neo['estimated_diameter']['meters']['estimated_diameter_max'], 2),
            'velocity': neo['close_approach_data'][0]['relative_velocity']['kilometers_per_hour'] if neo['close_approach_data'] else "N/A",
            'miss_distance': neo['close_approach_data'][0]['miss_distance']['kilometers'] if neo['close_approach_data'] else "N/A"
        })

    return jsonify(asteroids)

@app.route('/impact', methods=['POST'])
def impact_effect():
    data = request.json
    diameter = float(data['diameter'])
    velocity = float(data['velocity'])

    # Simple formula for energy
    mass = (4/3) * 3.14 * (diameter/2)**3 * 3000  # average density
    velocity_mps = velocity * 1000 / 3600
    energy = 0.5 * mass * velocity_mps**2
    energy_megatons = energy / 4.184e15  # convert to megatons TNT

    crater = round((diameter * 20), 2)  # rough crater size

    return jsonify({
        'energy_megatons': round(energy_megatons, 2),
        'crater_km': crater
    })

if __name__ == "__main__":
    app.run(debug=True)
