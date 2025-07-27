# Chạy dự án:
npm install
npm run start
# Kiểm tra views:
http://localhost:3000/
http://localhost:3000/users
# Kiểm tra Post usersService.create:
Invoke-RestMethod -Uri http://localhost:3001/users -Method Post -ContentType "application/json" -Body '{"name":"Alice","age":22}'