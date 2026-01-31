import mysql.connector
import json

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="hotel_booking_db"
    )
    cursor = conn.cursor(dictionary=True)

    results = {}

    # 1. Get all hotels
    cursor.execute("SELECT id, name FROM hotels")
    results['hotels'] = cursor.fetchall()

    # 2. Get SBH2 room types
    cursor.execute("SELECT rt.id, rt.name, rt.price_per_night, h.name as hotel FROM room_types rt JOIN hotels h ON rt.hotel_id = h.id WHERE h.name LIKE '%SBH2%'")
    results['sbh2_room_types'] = cursor.fetchall()

    # 3. Get bookings with price 18500
    cursor.execute("SELECT b.id, h.name as hotel, rt.name as room, b.total_price, b.hotel_id, b.room_type_id FROM bookings b JOIN hotels h ON b.hotel_id = h.id JOIN room_types rt ON b.room_type_id = rt.id WHERE b.total_price = 18500")
    results['expensive_bookings'] = cursor.fetchall()

    with open('db_diagnostic.json', 'w') as f:
        json.dump(results, f, indent=4, default=str)
    
    print("Diagnostic complete. Results written to db_diagnostic.json")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
