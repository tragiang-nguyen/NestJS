# Khởi động ngrok
ngrok config add-authtoken 2zsUCpgKwB1DUzOmw9Cu16U7KyY_LyafyU6iZus7TPk95h8C
ngrok http 2000

# Chạy dự án
npm install @nestjs/axios @nestjs/config express-handlebars class-validator class-transformer
npm run start:dev

# Tạo các Webhook trong Bitrix24
Outbound Webhook:
Your processing URL: https://70dba42fde0b.ngrok-free.app/contacts/bitrix/Reinstall
Events: Contact created, Contact updated, Contact deleted
Webhook in:
Webhook to call REST API: https://tragiang.bitrix24.vn/rest/1/dbk0yfbd00lbwyb3/

# Kiểm tra CRUD
thao tác trên: http://localhost:2000/contacts