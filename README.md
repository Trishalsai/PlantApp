# Plant App initialisation guide

## When you see this file in ec2 instance first note down the public IP address.
### 1. Activate venv
```source /PlantApp/venv/bin/activate```

### 2. Change the public IP in nginx and restart
#### To access nginx server settings type: 
```sudo vim /etc/nginx/sites-enabled/fastapi_nginx```
#### Change the IP in the attribute ```server_name```

### 3. Start the python file in sudo mode
```python3 -m uvicorn Plantapp:app```

## Now your api should be working, update the public IP in the frontend too, to make sure the API request is catered properly.
