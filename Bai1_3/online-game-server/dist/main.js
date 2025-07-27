"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Cấu hình static assets
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    // Cấu hình thư mục views
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
}
bootstrap();
