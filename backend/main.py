from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique ['http://localhost:3000'] se preferir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/color")
async def get_random_color():
    colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF3", "#FFDD33", "#33FFDD"] #oiiiII
    return {"cor": random.choice(colors)}

@app.get("/cat")
async def get_random_cat_image():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.thecatapi.com/v1/images/search")
        if response.status_code == 200:
            data = response.json()
            image_url = data[0]['url'] if data else "https://via.placeholder.com/150/FF0000/FFFFFF?text=No+Cat+Found"
            return {"cat_image_url": image_url}
        return JSONResponse(content={"error": "Failed to fetch cat image"}, status_code=response.status_code)

@app.get("/random-photo")
async def get_random_photo():
    width = random.randint(300, 800)
    height = random.randint(300, 800)
    photo_url = f"https://picsum.photos/{width}/{height}"
    return {"random_photo_url": photo_url}

@app.get("/time")
async def get_current_time():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"current_time": now}

@app.get("/joke")
async def get_joke():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://official-joke-api.appspot.com/random_joke")
        if response.status_code == 200:
            joke_data = response.json()
            joke_text = f"{joke_data.get('setup', '')} - {joke_data.get('punchline', '')}"
            return {"joke": joke_text}
        return JSONResponse(content={"error": "Failed to fetch joke"}, status_code=response.status_code)

@app.get("/scare")
async def scare():
    scare_images = [
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
        "https://media.giphy.com/media/26xBI73gWquCBBCDe/giphy.gif",
        "https://media.giphy.com/media/3o7TKr3nzgq5DlvmLt/giphy.gif"
    ]
    random_scare = random.choice(scare_images)
    return {"scare_image_url": random_scare}

@app.get("/lookalike")
async def lookalike():
    lookalike_images = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://randomuser.me/api/portraits/lego/1.jpg",
        "https://randomuser.me/api/portraits/thumb/men/75.jpg"
    ]
    random_lookalike = random.choice(lookalike_images)
    return {"lookalike_image_url": random_lookalike}

@app.get("/health")
async def health_check():
    """Verifica se a aplicação está em execução."""
    return {"status": "UP", "hostname": os.uname().nodename}

@app.get("/ready")
async def readiness_check(response: Response):
    """Verifica se a aplicação está pronta para receber tráfego."""
    is_ready = True
    if is_ready:
        response.status_code = 200
        return {"status": "READY", "hostname": os.uname().nodename}
    else:
        response.status_code = 503
        return {"status": "NOT READY", "hostname": os.uname().nodename}

@app.get("/")
async def read_root():
    return {"message": "Bem-vindo ao Desafio DevOps FastAPI + React!"}
