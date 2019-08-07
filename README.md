安装指南

首先将代码clone到本地：
`git clone https://github.com/PlayUnknown/GithubMonitor.git`

1. docker 部署
我们推荐使用Docker进行部署, 相对于源码部署更为简单和快速。

部署前请务必先安装Docker及docker-compose。

修改配置文件
首先复制根目录的.env.docker并重命名为.env，修改其中的Email Settings和initial Administrator配置。这两个配置分别控制邮件提醒，以及初始管理帐号密码。
注意: 如果需要访问的地址不是127.0.0.1或localhost, 需要修改ALLOWED_HOST参数,将访问地址加到里面,
如: ALLOWED_HOSTS="127.0.0.1,localhost"

```#Django Settings
DEBUG="True"  # Django后台是否以debug模式运行, 可选True/False
ALLOWED_HOSTS="*,127.0.0.1,localhost"  # 配置Django Allowed_Hosts, 如果DEBUG为False, 需要将访问的host地址添加进来，如'localhost,github.vipkid.com.cn'
#Database Settings
#DATABASE choice is mysql or sqlite
DATABASE="sqlite"  # 数据库类型, 可选sqlite或mysql
DB_NAME="github"  # 数据库名称
DB_HOST="127.0.0.1"  # mysql host
DB_PORT="3306"  # mysql port
DB_USER="root"  # mysql用户名
DB_PASSWORD="vipkid@2018"  # mysql密码
#Redis Settings
REDIS_HOST="127.0.0.1"  # redis host
REDIS_PORT="6379"  # redis port
REDIS_PASSWORD=""  # redis password
#Email Settings
#If you do not fill it in, it is None/False
EMAIL_HOST="smtp.example.com"  # smtp host
EMAIL_PORT="25"  # smtp port
FROM_EMAIL="secuirty@example.com"  # 发件人
EMAIL_HOST_USER="security@example.com"  # email user, 如为匿名发送，将值设为空字符即可
EMAIL_HOST_PASSWORD="password123!@#"  # email password, 如为匿名发送，将值设为空字符即可
EMAIL_USE_TLS="False"  # 与SMTP服务器通信时是否使用TLS（安全）连接, 可选True/False
EMAIL_USE_SSL="False"  # 与SMTP服务器通信时是否使用SSL（安全）连接, 可选True/False
#initial Administrator
INIT_ADMIN_USERNAME="admin"  # 初始化系统用户使用的用户名
INIT_ADMIN_PASSWORD="password123!@#"  # 初始化系统用户使用的用户密码
```
一键启动
`docker-compose up -d`
访问http://127.0.0.1:8001即可看到页面。

注意: 第一次启动由于mysql容器启动时间较久，可能会用30s左右的时间，页面才可以正常访问

修改启动端口
如果想修改启动端口，可以修改`docker-compose.yaml`文件中web容器的ports。

默认为8001:80，比如要修改为8080端口可改为8080:80。

2. 源码部署:
项目运行依赖 redis, 请在运行服务前启动redis-server

首先将.env.sample复制一份重命名为.env，并按照自己的要求修改配置:


后端代码运行部署:
测试环境可以使用django runserver的方式来进行部署，生产环境建议使用uwsgi + Nginx的方式部署，配置文件的示例可以参考 配置 目录下的文件。

进入项目根目录下的server目录

配置virtualenv环境（建议）

在mysql里创建数据库(如使用sqlite、请忽略此步):

登录进mysql后， 执行 CREATE DATABASE IF NOT EXISTS github DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_bin;

在server目录下执行如下脚本:
```
#安装python依赖
pip3 install -r requirements.pip -i http://pypi.doubanio.com/simple --trusted-host pypi.doubanio.com
#初始化数据库
python3 manage.py migrate
#初始化用户账号
python3 manage.py init_admin
#启动web后端服务:
python3 manage.py runserver 127.0.0.1:8001
#启动监控任务服务:
python3 manage.py monitor_task_service
前端代码部署:
测试环境可以使用 npm run start 方式启动, 生产环境建议先通过 npm run build生成静态文件，然后通过nginx做转发来做。

进入项目根目录下的client目录
如果后端接口地址不为 127.0.0.1:8001, 需要修改config/config.local.js, 将target修改为后端地址即可
执行: npm install && npm run start
```
使用手册
1.添加Token
Github Monitor使用Github REST API v3接口进行搜索，所以需要预先配置Token进行认证。

首先登录Github，然后进入Token配置页面创建Token。

随后把Token添加到Github Monitor中。

![image](https://github.com/PlayUnknown/GithubMonitor/blob/master/%E7%99%BB%E5%BD%95TOKEN.png)

Github API有次数限制，1分钟最多请求30次，为了提高爬取速度，Github Monitor支持添加多个Token。

2.添加监控任务
![image](https://github.com/PlayUnknown/GithubMonitor/blob/master/%E6%B7%BB%E5%8A%A0%E7%9B%91%E6%8E%A7%E4%BB%BB%E5%8A%A1.png)

任务名称：仅做标记使用,无实际意义。
关键词：支持多个关键词，每行一个，支持Github REST API v3搜索语法，如：vipkid extension:java，只搜索java后缀文件。
忽略帐号：不支持模糊匹配，忽略指定帐号下的仓库，同样支持多个帐号，换行分隔。
忽略仓库：支持模糊匹配，比如：github.io，可忽略test.github.io、vipkid.github.io等仓库。
邮箱：可为空，不填则不会邮件提醒。
爬取页数：默认5页，每页50条数据。
爬取间隔：默认60分钟，可根据自己需求修改。
3.确认/忽略风险
如图：

![image](https://github.com/PlayUnknown/GithubMonitor/blob/master/%E7%A1%AE%E8%AE%A4%E5%BF%BD%E7%95%A5%E9%A3%8E%E9%99%A9.png)

爬虫爬取到的数据会入库，可以在查询系统中进行操作，进行处理/加白/忽略仓库操作。

处理：确认有风险，需要处理。
加白：确认无风险，以后不会再提醒，如果文件有修改，还是会再次提醒。
忽略仓库：批量加白该仓库下已经发现的信息。
