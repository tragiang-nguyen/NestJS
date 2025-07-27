# Khởi động ngrok
chạy các lệnh trong ngrok:
ngrok config add-authtoken 2zsUCpgKwB1DUzOmw9Cu16U7KyY_LyafyU6iZus7TPk95h8C
ngrok http 1234

# Chạy dự án
npm install axios sqlite3 dotenv
npm run start:dev

# Tạo ứng dụng mới trong Bitrix24
Your processing path: https://6abc4794075c.ngrok-free.app/bitrix/handling
Initial installation path: https://6abc4794075c.ngrok-free.app/bitrix/install

# Kiểm tra lưu access token và refresh token trong install_auth.json

# Kiểm tra renew token khi hết hạn
mở git chạy lệnh trong thư mục dự án:
curl -X POST https://6abc4794075c.ngrok-free.app/bitrix/api      -H "Content-Type: application/json"      -d '{"endpoint":"crm.lead.list","action":"list","payload":{}}'

# Kiểm tra chức năng gọi API bất kỳ với token đang có
thêm quyền user và crm trong bitrix24
mở git chạy lệnh trong thư mục dự án:
curl -X POST https://6abc4794075c.ngrok-free.app/bitrix/api      -H "Content-Type: application/json"      -d '{"endpoint":"user.current","action":"get","payload":{}}'