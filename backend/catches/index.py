"""
API для уловов: получение ленты, создание улова, лайки. Поддерживает авторизацию через токен.
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
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    params = event.get("queryStringParameters") or {}

    conn = get_db()
    cur = conn.cursor()

    try:
        user_id = get_user_id(cur, token)

        # GET / — лента уловов
        if method == "GET":
            limit = int(params.get("limit", 20))
            offset = int(params.get("offset", 0))
            cur.execute(
                f"""SELECT c.id, c.fish_type, c.weight_kg, c.gear, c.description, c.location_name,
                           c.likes_count, c.created_at, u.username, u.rank, u.avatar_url,
                           CASE WHEN cl.user_id IS NOT NULL THEN true ELSE false END as liked
                    FROM {SCHEMA}.catches c
                    JOIN {SCHEMA}.users u ON u.id = c.user_id
                    LEFT JOIN {SCHEMA}.catch_likes cl ON cl.catch_id = c.id AND cl.user_id = %s
                    ORDER BY c.created_at DESC
                    LIMIT %s OFFSET %s""",
                (user_id, limit, offset)
            )
            rows = cur.fetchall()
            catches = []
            for r in rows:
                catch_id = str(r[0])
                cur.execute(f"SELECT url FROM {SCHEMA}.catch_photos WHERE catch_id = %s ORDER BY created_at", (catch_id,))
                photos = [row[0] for row in cur.fetchall()]
                catches.append({
                    "id": catch_id,
                    "fish_type": r[1],
                    "weight_kg": float(r[2]) if r[2] else None,
                    "gear": r[3],
                    "description": r[4],
                    "location_name": r[5],
                    "likes_count": r[6],
                    "created_at": r[7].isoformat(),
                    "user": {"username": r[8], "rank": r[9], "avatar_url": r[10]},
                    "photos": photos,
                    "liked": r[11],
                })
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(catches)}

        # POST / — создать улов
        if method == "POST" and not path.endswith("/like"):
            if not user_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нужна авторизация"})}
            catch_id = str(uuid.uuid4())
            cur.execute(
                f"""INSERT INTO {SCHEMA}.catches (id, user_id, fish_type, weight_kg, gear, description, location_name, lat, lng)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (catch_id, user_id, body.get("fish_type", "Неизвестная"),
                 body.get("weight_kg"), body.get("gear"), body.get("description"),
                 body.get("location_name"), body.get("lat"), body.get("lng"))
            )
            for url in (body.get("photos") or [])[:3]:
                cur.execute(f"INSERT INTO {SCHEMA}.catch_photos (catch_id, url) VALUES (%s, %s)", (catch_id, url))
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"id": catch_id})}

        # POST /like
        if method == "POST" and path.endswith("/like"):
            if not user_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нужна авторизация"})}
            catch_id = body.get("catch_id")
            cur.execute(f"SELECT 1 FROM {SCHEMA}.catch_likes WHERE user_id = %s AND catch_id = %s", (user_id, catch_id))
            if cur.fetchone():
                cur.execute(f"UPDATE {SCHEMA}.catches SET likes_count = likes_count - 1 WHERE id = %s", (catch_id,))
                cur.execute(f"DELETE FROM {SCHEMA}.catch_likes WHERE user_id = %s AND catch_id = %s", (user_id, catch_id))
                liked = False
            else:
                cur.execute(f"INSERT INTO {SCHEMA}.catch_likes (user_id, catch_id) VALUES (%s, %s)", (user_id, catch_id))
                cur.execute(f"UPDATE {SCHEMA}.catches SET likes_count = likes_count + 1 WHERE id = %s", (catch_id,))
                liked = True
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"liked": liked})}

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()
