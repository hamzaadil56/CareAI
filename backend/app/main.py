from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from routes import donors, patients
import uvicorn

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Include the routers
app.include_router(donors.router, prefix="/donors", tags=["Donors"])
app.include_router(patients.router, prefix="/patients", tags=["Patients"])

# Root route with links


@app.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
    <html>
        <head>
            <title>Care AI</title>
        </head>
        <body>
            <h1>Care AI</h1>
            
            <ul style="list-style: none;">
                <li><a href="/donors/">Donors Dashboard</a></li>
                <li><a href="/patients/">Patients Dashboard</a></li>
            </ul>
        </body>
    </html>
    """
    return html_content

# Add this block to run the server directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
