"""
Маркеры на карте: получить активные, создать новый (макс 3 на юзера), удалить свои.
"""
import json
import os
import uuid
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p26368353_quantum_research_ini")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user_id(cur, token: str):
    if not token:
        return None
    cur.execute(
        f"SELECT user_id FROM {SCHEMA}.sessions WHERE token = %s AND expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    return str(row[0]) if row else None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    body = json.loads(event.get("body") or "{}")
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")

    conn = get_db()
    cur = conn.cursor()

    try:
        user_id = get_user_id(cur, token)

        # GET / — все активные маркеры
        if method == "GET":
            cur.execute(
                f"""SELECT m.id, m.type, m.lat, m.lng, m.message, m.fish_type, m.created_at,
                           u.username, u.rank, u.avatar_url,
                           CASE WHEN m.user_id = %s THEN true ELSE false END as is_own
                    FROM {SCHEMA}.map_markers m
                    JOIN {SCHEMA}.users u ON u.id = m.user_id
                    WHERE m.expires_at > NOW()
                    ORDER BY m.created_at DESC""",
                (user_id,)
            )
            rows = cur.fetchall()
            markers = [
                {
                    "id": str(r[0]), "type": r[1], "lat": float(r[2]), "lng": float(r[3]),
                    "message": r[4], "fish_type": r[5], "created_at": r[6].isoformat(),
                    "user": {"username": r[7], "rank": r[8], "avatar_url": r[9]},
                    "is_own": r[10]
                }
                for r in rows
            ]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(markers)}

        # POST / — создать маркер
        if method == "POST":
            if not user_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нужна авторизация"})}
            cur.execute(
                f"SELECT COUNT(*) FROM {SCHEMA}.map_markers WHERE user_id = %s AND expires_at > NOW()",
                (user_id,)
            )
            count = cur.fetchone()[0]
            if count >= 3:
                return {"statusCode": 429, "headers": CORS, "body": json.dumps({"error": "Лимит 3 маркера на 24 часа"})}

            marker_id = str(uuid.uuid4())
            cur.execute(
                f"""INSERT INTO {SCHEMA}.map_markers (id, user_id, type, lat, lng, message, fish_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (marker_id, user_id, body.get("type", "catch"),
                 body["lat"], body["lng"], body.get("message"), body.get("fish_type"))
            )
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"id": marker_id})}

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
