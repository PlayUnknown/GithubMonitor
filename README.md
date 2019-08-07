源码部署:
项目运行依赖 redis, 请在运行服务前启动redis-server
需要安装MySQL 并启动服务
首先将.env.sample复制一份重命名为.env，并按照自己的要求修改配置:

# Django Settings
DEBUG="True"  # Django后台是否以debug模式运行, 可选True/False
ALLOWED_HOSTS="*,127.0.0.1,localhost"  # 配置Django Allowed_Hosts, 如果DEBUG为False, 需要将访问的host地址添加进来，如'localhost,github.vipkid.com.cn'

# Database Settings
# DATABASE choice is mysql or sqlite
DATABASE="sqlite"  # 数据库类型, 可选sqlite或mysql
DB_NAME="github"  # 数据库名称
DB_HOST="127.0.0.1"  # mysql host
DB_PORT="3306"  # mysql port
DB_USER="root"  # mysql用户名
DB_PASSWORD="vipkid@2018"  # mysql密码

# Redis Settings
REDIS_HOST="127.0.0.1"  # redis host
REDIS_PORT="6379"  # redis port
REDIS_PASSWORD=""  # redis password

# Email Settings
# If you do not fill it in, it is None/False
EMAIL_HOST="smtp.example.com"  # smtp host
EMAIL_PORT="25"  # smtp port
FROM_EMAIL="secuirty@example.com"  # 发件人
EMAIL_HOST_USER="security@example.com"  # email user, 如为匿名发送，将值设为空字符即可
EMAIL_HOST_PASSWORD="password123!@#"  # email password, 如为匿名发送，将值设为空字符即可
EMAIL_USE_TLS="False"  # 与SMTP服务器通信时是否使用TLS（安全）连接, 可选True/False
EMAIL_USE_SSL="False"  # 与SMTP服务器通信时是否使用SSL（安全）连接, 可选True/False

# initial Administrator
INIT_ADMIN_USERNAME="admin"  # 初始化系统用户使用的用户名
INIT_ADMIN_PASSWORD="password123!@#"  # 初始化系统用户使用的用户密码

后端代码运行部署:
测试环境可以使用django runserver的方式来进行部署，生产环境建议使用uwsgi + Nginx的方式部署，配置文件的示例可以参考 配置 目录下的文件。

进入项目根目录下的server目录

配置virtualenv环境（建议）

在mysql里创建数据库(如使用sqlite、请忽略此步):

登录进mysql后， 执行 CREATE DATABASE IF NOT EXISTS github DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_bin;

在server目录下执行如下脚本:

# 安装python依赖
pip3 install -r requirements.pip -i http://pypi.doubanio.com/simple --trusted-host pypi.doubanio.com
# 初始化数据库
python3 manage.py migrate
# 初始化用户账号
python3 manage.py init_admin
# 启动web后端服务:
python3 manage.py runserver 127.0.0.1:8001
# 启动监控任务服务:
python3 manage.py monitor_task_service
前端代码部署:
测试环境可以使用 npm run start 方式启动, 生产环境建议先通过 npm run build生成静态文件，然后通过nginx做转发来做。

进入项目根目录下的client目录
如果后端接口地址不为 127.0.0.1:8001, 需要修改config/config.local.js, 将target修改为后端地址即可
执行: npm install && npm run start
