from flask import Flask,request,json,jsonify
import pymysql.cursors

app = Flask(__name__, static_url_path='')  # Static resource path HTML, CSS, JS, IMGs

@app.route('/')
def root():
    return app.send_static_file('index.html')

#################################################
@app.route('/todo/create',methods=['POST'])
def create():
    if request.method=='POST':
     
     result=request.get_json();
     data = request.get_json(force=True); 
     itemDescription = data.get("taskitem")
     # Connect to the database
     connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='myroot123',
                             db='mysql',
                             charset='utf8mb4',
			                 cursorclass=pymysql.cursors.DictCursor);
     try:
  
      with connection.cursor() as cursor:
        sql = "INSERT INTO todolist (description) VALUES (%s)"
        cursor.execute(sql, itemDescription)
        connection.commit()
        
     finally:
      connection.close()
      return "Created successfully."
    else:
      return "Processing Error"
	  
################################################
@app.route('/todo/delete',methods=['POST'])
def delete():
    if request.method=='POST':
     
     result=request.get_json();
     data = request.get_json(force=True); 
     itemDescription = data.get("taskitem")
     # Connect to the database
     connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='myroot123',
                             db='mysql',
                             charset='utf8mb4',
			                 cursorclass=pymysql.cursors.DictCursor);
     try:
  
      with connection.cursor() as cursor:
        sql = "DELETE FROM todolist WHERE Description=(%s)"
        cursor.execute(sql, itemDescription)
        connection.commit()
        
     finally:
      connection.close()
      return "Deleted successfully."
    else:
      return "Processing Error"
	  
###################################################
@app.route('/todo/update',methods=['POST'])
def update():
    if request.method=='POST':
     
     result=request.get_json();
     data = request.get_json(force=True); 
     olditemDescription = data.get("oldtaskitem")
     newitemDescription = data.get("newtaskitem")
     # Connect to the database
     connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='myroot123',
                             db='mysql',
                             charset='utf8mb4',
		            	     cursorclass=pymysql.cursors.DictCursor);
     try:
  
      with connection.cursor() as cursor:
        sql = "UPDATE todolist SET Description=(%s) WHERE Description=(%s)"
        cursor.execute(sql, (newitemDescription, olditemDescription))
        connection.commit()
		
     finally:
      connection.close()
      return "Updated successfully."
    else:
      return "Processing Error"

######################################################
@app.route('/todo/read',methods=['GET'])
def read():
    if request.method=='GET':
     connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='myroot123',
                             db='mysql',
                             charset='utf8mb4',
			                 cursorclass=pymysql.cursors.DictCursor);
     try:
      
      with connection.cursor() as cursor:
        sql = "SELECT description FROM todolist"
        cursor.execute(sql)
        connection.commit()
		
     finally:
      return jsonify(data=cursor.fetchall())
    else:
      return "Processing Error"
     
if __name__ == "__main__":
    app.run(host='0.0.0.0')
	
###################################################### 
