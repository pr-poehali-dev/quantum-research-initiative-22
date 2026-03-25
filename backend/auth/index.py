"""
Авторизация рыбаков: регистрация/вход по email или телефону + управление сессиями.
"""
import json
import os
import uuid
import hashlib
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p26368353_quantum_research_ini")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def make_token(user_id: str) -> str:
    return hashlib.sha256(f"{user_id}{uuid.uuid4()}".encode()).hexdigest()


def get_rank(fishcoins: int) -> str:
    if fishcoins >= 5000:
        return "Легенда"
    if fishcoins >= 2500:
        return "Эксперт"
    if fishcoins >= 1000:
        return "Мастер"
    if fishcoins >= 500:
        return "Рыбак"
    if fishcoins >= 200:
        return "Любитель"
    return "Новичок"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")

    conn = get_db()
    cur = conn.cursor()

    try:
        action = body.get("action") or ("me" if method == "GET" else None)

        # register
        if action == "register":
            email = body.get("email", "").strip().lower()
            phone = body.get("phone", "").strip()
            username = body.get("username", "Рыбак").strip()

            if not email and not phone:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "email или phone обязателен"})}

            if email:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
            else:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone = %s", (phone,))
            if cur.fetchone():
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Пользователь уже существует"})}

            user_id = str(uuid.uuid4())
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (id, email, phone, username) VALUES (%s, %s, %s, %s) RETURNING id, username, fishcoins, rank",
                (user_id, email or None, phone or None, username)
            )
            row = cur.fetchone()
            token = make_token(user_id)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
            conn.commit()
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"token": token, "user": {"id": row[0], "username": row[1], "fishcoins": row[2], "rank": row[3]}})
            }

        # login
        if action == "login":
            email = body.get("email", "").strip().lower()
            phone = body.get("phone", "").strip()

            if email:
                cur.execute(f"SELECT id, username, fishcoins, rank FROM {SCHEMA}.users WHERE email = %s", (email,))
            else:
                cur.execute(f"SELECT id, username, fishcoins, rank FROM {SCHEMA}.users WHERE phone = %s", (phone,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Пользователь не найден"})}

            user_id, username, fishcoins, rank = row
            token = make_token(str(user_id))
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (str(user_id), token))
            cur.execute(f"UPDATE {SCHEMA}.users SET last_seen_at = NOW() WHERE id = %s", (str(user_id),))
            conn.commit()
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"token": token, "user": {"id": str(user_id), "username": username, "fishcoins": fishcoins, "rank": rank}})
            }

        # me
        if action == "me" or method == "GET":
            tok = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
            if not tok:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нет токена"})}
            cur.execute(
                f"""SELECT u.id, u.username, u.fishcoins, u.rank, u.avatar_url, u.email, u.phone
                    FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id
                    WHERE s.token = %s AND s.expires_at > NOW()""",
                (tok,)
            )
            row = cur.fetchone()
            if not row:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}
            return {
                "statusCode": 200, "headers": CORS,
                "body": json.dumps({"id": str(row[0]), "username": row[1], "fishcoins": row[2], "rank": row[3], "avatar_url": row[4], "email": row[5], "phone": row[6]})
            }

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
    finally:
        cur.close()
        conn.close()