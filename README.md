## order manage system

> ## 特别说明：所有内容，禁止一切形式的转载，发布以及用于任何其他用途。
### init
- 复制一份 .env.example 成.env于根目录。修改数据库等配置。
- 运行 php artisan migrate
- 运行 php artisan db:seed

> 设置了两个默认用户。
```
// 超级管理员
    newbeta@admin.com
    newbeta
//boss
    newbeta@boss.com
    newbeta
```

