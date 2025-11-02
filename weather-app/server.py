from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "fb89b26dd6ffda9c5a2e89725c6940a4"  #key

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/weather")
def get_weather():
    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    else:
        return jsonify({"error": "Provide city or lat & lon"}), 400

    try:
        data = requests.get(url).json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
