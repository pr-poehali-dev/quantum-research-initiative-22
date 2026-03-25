"""
Загрузка фото улова в S3. Принимает base64-изображение, сохраняет, возвращает CDN URL.
"""
import json
import os
import uuid
import base64
import boto3

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    image_b64 = body.get("image")
    content_type = body.get("content_type", "image/jpeg")

    if not image_b64:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "image обязателен"})}

    image_data = base64.b64decode(image_b64)
    ext = "jpg" if "jpeg" in content_type else content_type.split("/")[-1]
    key = f"catches/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"url": cdn_url})}
