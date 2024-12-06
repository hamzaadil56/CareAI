from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from app.routes import donors, patients

app = FastAPI()

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
         
            <h1>Care AI</h1>
            
            <ul style="list-style: none;">
                <li><a href="/donors/">Donors Dashboard</a></li>
                <li><a href="/patients/">Patients Dashboard</a></li>
            </ul>
        </body>
    </html>
    """
    return html_content
