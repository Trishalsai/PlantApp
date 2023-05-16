from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Numbers(BaseModel):
    num1: int
    num2: int


@app.post('/sum')
def sum_numbers(numbers: Numbers):
    result = numbers.num1 + numbers.num2
    return {'result': result}
